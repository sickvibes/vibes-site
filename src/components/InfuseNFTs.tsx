import { BigNumber, ContractTransaction } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import React, { FunctionComponent, ReactNode } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { getContracts } from '../contracts';
import { useProtocol } from '../hooks/protocol';
import { useWallet } from '../hooks/wallet';
import { Metadata, resolveMetadata } from '../lib/nft';
import { formatBytes } from '../lib/strings';
import { getNFTDetails, NFTView } from '../web3/wellspringv2';
import { infuseNft } from '../web3/infusion-pool';
import { Address, ExplorerButton } from './Address';
import { Button } from './Button';
import { ButtonGroup } from './ButtonGroup';
import { Connect } from './Connect';
import { Content } from './Content';
import { CuratorGate } from './Curate';
import { DecimalNumber } from './DecimalNumber';
import { FlashingLabel } from './FlashingLabel';
import { Input } from './Input';
import { PageSection } from './PageSection';
import { Title } from './Title';
import { TwoPanel } from './TwoPanel';
import { Vibes } from './Vibes';
import { useTokens } from '../hooks/tokens';

export const InfuseNFTs: FunctionComponent = () => {
  return (
    <>
      <PageSection>
        <Content>
          <Connect>
            <CuratorGate>
              <Infuser />
            </CuratorGate>
          </Connect>
        </Content>
      </PageSection>
    </>
  );
};

export const Infuser: FunctionComponent = () => {
  const { accountView } = useWallet();
  const { protocolView } = useProtocol();
  const [days, setDays] = useState(50);
  const [tokenId, setTokenId] = useState('');
  const [nft, setNft] = useState(getContracts().ssw);
  const [uiState, setUiState] = useState<'input' | 'confirm' | { trx: string }>('input');

  if (uiState === 'confirm') {
    return (
      <>
        <Confirm days={days} nft={nft} tokenId={tokenId} back={() => setUiState('input')} />
      </>
    );
  }

  const allowance = protocolView.infusionPool.allowances.find((a) => a.address === accountView.address);
  const allowanceAmount = allowance?.amount ?? BigNumber.from(0);
  const { constraints, balance } = protocolView.infusionPool;

  const amount = BigNumber.from(days).mul(constraints.maxDailyRate);

  let error: ReactNode = '';
  if (amount.gt(constraints.maxValue)) {
    error = (
      <>
        Total infused value cannot exceed <DecimalNumber number={constraints.maxValue} decimals={0} /> <Vibes />
      </>
    );
  } else if (amount.lt(constraints.minValue)) {
    error = (
      <>
        Total infused value must be at least <DecimalNumber number={constraints.minValue} decimals={0} /> <Vibes />
      </>
    );
  } else if (amount.gt(allowanceAmount)) {
    error = (
      <>
        Infusion amount exceeds your <DecimalNumber number={allowanceAmount} decimals={0} /> <Vibes /> grant allowance
      </>
    );
  } else if (amount.gt(balance)) {
    error = (
      <>
        Infusion amount exceeds the <DecimalNumber number={balance} decimals={0} /> <Vibes /> remaining pool balance
      </>
    );
  }

  const showError = error !== '' && tokenId != '' && days !== 0;
  const disableConfirm = error !== '' || tokenId === '' || days === 0;

  return (
    <>
      <Title>Infuse</Title>
      <Content>
        <p>
          Infuse an NFT from your wallet with <Vibes /> to add it to the curated network:
        </p>
        <p>
          <strong>NFT Contract</strong>:<br />
          <Button active={nft === getContracts().sswv0} onClick={() => setNft(getContracts().sswv0)}>
            SSW v0
          </Button>{' '}
          <Button active={nft === getContracts().ssw} onClick={() => setNft(getContracts().ssw)}>
            SSW v1
          </Button>
        </p>
        <p>
          <strong>Token ID</strong>:
          <Input placeholder="Token ID" value={tokenId} onTextChange={(t) => setTokenId(t)} regex={/^[0-9]*$/} />
        </p>
        <p>
          <strong>
            Days worth of <Vibes /> to Infuse
          </strong>
          :
          <Input placeholder="Days" value={days} onTextChange={(t) => setDays(Number(t))} regex={/^[0-9]*$/} />
        </p>
        <p>
          <strong>Daily Rate</strong>:<br />
          1,000 <Vibes /> / day
        </p>
        {showError && <p>⚠️ {error}</p>}
        <ButtonGroup>
          <Button disabled={disableConfirm} onClick={() => setUiState('confirm')}>
            👀 CONFIRM
          </Button>
          <Button navTo="/curate">🙅‍♀️ CANCEL</Button>
        </ButtonGroup>
      </Content>
    </>
  );
};

const Confirm: FunctionComponent<{ tokenId: string; nft: string; days: number; back: () => unknown }> = (props) => {
  const { account, library, registerTransactions } = useWallet();
  const [nftView, setNftView] = useState<NFTView>(null);
  const [metadata, setMetadata] = useState<Metadata>(null);
  const [trx, setTrx] = useState<ContractTransaction>(null);
  const { protocolView } = useProtocol();
  const { tokens } = useTokens();

  useEffect(() => {
    fetchNft();
  }, [props.tokenId]);

  const dailyRate = parseEther('1000');
  const { nft, tokenId, days, back } = props;
  const amount = dailyRate.mul(days);

  const fetchNft = async () => {
    const [view] = await getNFTDetails([{ nft, tokenId }]);
    setNftView(view);
    const metadata = await resolveMetadata(view);
    setMetadata(metadata);
  };

  const infuse = async () => {
    const trx = await infuseNft(nft, tokenId, dailyRate, days, library.getSigner());
    registerTransactions(trx);
    setTrx(trx);
  };

  const { constraints } = protocolView.infusionPool;
  const ownedFlagOkay = Boolean(!constraints.requireOwnedNft || nftView?.owner === account);
  const alreadySeeded = Boolean(tokens.find((t) => t.isInfused && t.nft === nft && t.tokenId === tokenId));
  const allowInfuse = ownedFlagOkay && !alreadySeeded;

  if (trx) {
    return (
      <>
        <Title>Transaction Submitted</Title>
        <p>The infusion transaction has been submitted.</p>
        <ButtonGroup>
          <Button navTo="/wallet">⚡️ VIEW TRX in WALLET</Button>
          <Button navTo="/curate">✅ DONE</Button>
        </ButtonGroup>
      </>
    );
  }

  return (
    <>
      <Title>Confirm Infusion</Title>
      <PageSection>
        <TwoPanel>
          <div>
            <Content>
              <p>
                <strong>curator</strong>: <ExplorerButton address={account} />
                <br />
                <strong>daily rate</strong>: <DecimalNumber number={BigNumber.from(dailyRate)} decimals={0} /> <Vibes />{' '}
                / day
                <br />
                <strong>total days</strong>: {days} days
                <br />
                <br />
                <strong>TO INFUSE</strong>: <DecimalNumber number={amount} decimals={0} /> <Vibes />
              </p>
            </Content>
          </div>
          <div>
            <Content>
              <p>
                <strong>contract</strong>: <Address address={nft} />
                <br />
                <strong>token id</strong>: {tokenId}
                <br />
                {nftView && (
                  <>
                    <strong>nft owner</strong>: <ExplorerButton address={nftView.owner} />
                    <br />
                  </>
                )}
                {metadata && (
                  <>
                    <strong>nft creator</strong>:{' '}
                    {metadata.creator ? <ExplorerButton address={metadata.creator} /> : '-'}
                    <br />
                    <strong>nft title</strong>: {metadata.name}
                    <br />
                    <strong>nft mime type</strong>: {metadata.media?.mimeType ?? '-'}
                    <br />
                    <strong>nft media size</strong>: {formatBytes(metadata.media?.size)}
                    <br />
                  </>
                )}
                {!metadata && <>( ⌛️ loading metadata... )</>}
              </p>
              <ButtonGroup>
                <Button externalNavTo={`https://opensea.io/assets/matic/${nft}/${props.tokenId}`}>
                  view on opensea
                </Button>
              </ButtonGroup>
            </Content>
          </div>
        </TwoPanel>
      </PageSection>
      <PageSection>
        <Content>
          {allowInfuse && (
            <>
              <p>
                This a <FlashingLabel>PERMANENT</FlashingLabel> operation, it cannot be undone. NFTs can only be infused
                once!
              </p>
              <p>
                Infused <Vibes /> will come from the grant pool, not your wallet.
              </p>
            </>
          )}
          {nftView && !ownedFlagOkay && <p>⚠️ You can only infuse NFTs that you currently own.</p>}
          {alreadySeeded && <p>⚠️ This NFT has already been infused.</p>}
        </Content>
      </PageSection>
      <PageSection>
        <ButtonGroup>
          <Button disabled={!allowInfuse} onClick={infuse}>
            🔥 INFUSE
          </Button>
          <Button onClick={back}>🙅‍♀️ CANCEL</Button>
        </ButtonGroup>
      </PageSection>
    </>
  );
};
