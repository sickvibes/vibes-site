import React, { FunctionComponent, useEffect, useState } from 'react';
import { getContracts } from '../contracts';
import { Button } from './Button';
import { Content } from './Content';
import { Input } from './Input';
import { PageSection } from './PageSection';
import { Title } from './Title';
import { Vibes } from './Vibes';
import { BigNumber, utils } from 'ethers';
import { ButtonGroup } from './ButtonGroup';
import { ExplorerButton } from './Address';
import { DecimalNumber } from './DecimalNumber';
import { getNFTDetails, NFTView, InfusionInput, infuseNft } from '../web3/wellspringv2';
import { Metadata, resolveMetadata } from '../lib/nft';
import { formatBytes } from '../lib/strings';
import { TwoPanel } from './TwoPanel';
import { useWallet } from '../hooks/wallet';
import { approveInfinite, getAllowance } from '../web3/vibes';

export const Infusion: FunctionComponent = () => {
  const { account, library, registerTransactions, onTransactions } = useWallet();
  const [nft, setNft] = useState('');
  const [infuser, setInfuser] = useState('');
  const [tokenId, setTokenId] = useState('');
  const [dailyRate, setDailyRate] = useState(1000);
  const [totalDays, setTotalDays] = useState(30);
  const [uiState, setUiState] = useState<'input' | 'confirm' | { trx: string }>('input');
  const [nftView, setNftView] = useState<NFTView>(null);
  const [metadata, setMetadata] = useState<Metadata>(null);
  const [allowance, setAllowance] = useState<BigNumber>(BigNumber.from(0));

  useEffect(() => {
    if (uiState === 'confirm') {
      fetchNft();
    } else {
      setNftView(null);
      setMetadata(null);
    }
  }, [uiState]);

  useEffect(() => {
    fetchAllowance();
  }, [account]);

  useEffect(() => {
    const unhook = onTransactions(() => fetchAllowance());
    return unhook;
  }, []);

  const payload = {
    nft,
    tokenId,
    infuser,
    dailyRate: utils.parseUnits(`${dailyRate}`).toString(),
    totalDays: `${totalDays}`,
  };

  const fetchNft = async () => {
    const [view] = await getNFTDetails([{ nft, tokenId }]);
    setNftView(view);
    const metadata = await resolveMetadata(view);
    setMetadata(metadata);
  };

  const fetchAllowance = async () => {
    setAllowance(await getAllowance(account, getContracts().wellspringV2));
  };

  const approve = async () => {
    const trx = await approveInfinite(getContracts().wellspringV2, library.getSigner());
    registerTransactions(trx);
  };

  const infuse = async () => {
    const arg: InfusionInput = {
      nft,
      tokenId,
      seeder: infuser,
      dailyRate: BigNumber.from(payload.dailyRate),
      totalDays: Number(payload.totalDays),
    };
    const trx = await infuseNft(arg, library.getSigner());
    registerTransactions(trx);
  };

  return (
    <>
      <PageSection>
        <Content>
          <Title>Infuse VIBES NFTs</Title>
          <p>
            ⚠️ This page is used to prep the transactions the multisig executes to infuse NFTs with <Vibes />.
          </p>
        </Content>
      </PageSection>
      {uiState === 'input' && (
        <>
          <PageSection>
            <p>shortcuts:</p>
            <p>
              <Button onClick={() => setNft(getContracts().ssw)}>⚙️ SSW</Button>
              <Button onClick={() => setInfuser('0x303EeFeDeE1bA8e5d507a55465d946B2fea18583')}>🎨 bval</Button>
              <Button onClick={() => setInfuser('0x8AbAf5733742B1506F6a1255de0e37aEc76b7940')}>🎨 zamboni</Button>
              <Button onClick={() => setInfuser('0xA3e51498579Db0f7bb1ec9E3093B2F44158E25a5')}>🎨 sgt</Button>
              <Button onClick={() => setInfuser('0xb0432D4911Bc9283a853987cBb7704e123CE7393')}>🎨 wrecks</Button>
              <Button onClick={() => setInfuser('0xC2bD7faca51549dbB8E701f48baAF5C135374613')}>🎨 polyforms</Button>
              <Button onClick={() => setNft(getContracts().sqncr)}>⚙️ SQNCR</Button>
            </p>
          </PageSection>
          <PageSection>
            <p>
              infuser:
              <Input placeholder="Infuser address" value={infuser} onTextChange={(t) => setInfuser(t)} />
            </p>
            <p>
              nft:
              <Input placeholder="NFT contract address" value={nft} onTextChange={(t) => setNft(t)} />
            </p>
            <p>
              token id:
              <Input placeholder="Token ID" value={tokenId} onTextChange={(t) => setTokenId(t)} />
            </p>
            <p>
              daily rate:
              <Input
                placeholder="Daily VIBES rate"
                value={dailyRate}
                onTextChange={(t) => setDailyRate(Number(t))}
                regex={/^[0-9]*$/}
              />
            </p>
            <p>
              total days:
              <Input
                placeholder="Total days to mine VIBES"
                value={totalDays}
                onTextChange={(t) => setTotalDays(Number(t))}
                regex={/^[0-9]*$/}
              />
            </p>
            <ButtonGroup>
              <Button onClick={() => setUiState('confirm')}>CONFIRM</Button>
            </ButtonGroup>
          </PageSection>
        </>
      )}
      {uiState === 'confirm' && (
        <>
          <PageSection>
            <Button onClick={() => setUiState('input')}>BACK</Button>
          </PageSection>
          <PageSection>
            <TwoPanel>
              <div>
                <Content>
                  <p>
                    <strong>infuser</strong>: <ExplorerButton address={infuser} />
                    <br />
                    <strong>total days</strong>: {totalDays} days
                    <br />
                    <strong>daily rate</strong>:{' '}
                    <DecimalNumber number={BigNumber.from(payload.dailyRate)} decimals={0} /> <Vibes /> / day
                    <br />
                    <strong>TVL</strong>:{' '}
                    <DecimalNumber number={BigNumber.from(payload.dailyRate).mul(totalDays)} decimals={0} /> <Vibes />
                  </p>
                </Content>
              </div>
              <div>
                {nftView !== null && metadata !== null && (
                  <Content>
                    <p>
                      <strong>nft owner</strong>: <ExplorerButton address={nftView.owner} />
                      <br />
                      <strong>nft creator</strong>:{' '}
                      {metadata.creator ? <ExplorerButton address={metadata.creator} /> : '-'}
                      <br />
                      <strong>nft title</strong>: {metadata.name}
                      <br />
                      <strong>nft mime type</strong>: {metadata.media?.mimeType ?? '-'}
                      <br />
                      <strong>nft media size</strong>: {formatBytes(metadata.media?.size)}
                      <br />
                    </p>
                    <ButtonGroup>
                      <Button externalNavTo={`https://opensea.io/assets/matic/${nft}/${tokenId}`}>
                        view on opensea
                      </Button>
                    </ButtonGroup>
                  </Content>
                )}
              </div>
            </TwoPanel>
          </PageSection>
          <PageSection>
            <ButtonGroup>
              <Button
                disabled={allowance.gte(BigNumber.from(payload.dailyRate).mul(totalDays))}
                onClick={() => approve()}
              >
                APPROVE
              </Button>
              <Button
                // disabled={account !== '0x9940D367E0596f64DbcbBd57f480359E4A2F852f'} // treasury EOA
                onClick={() => infuse()}
              >
                SUBMIT TRX
              </Button>
            </ButtonGroup>
          </PageSection>
        </>
      )}
      {typeof uiState !== 'string' && 'trx' in uiState && (
        <>
          <PageSection>
            <Button onClick={() => setUiState('input')}>BACK</Button>
          </PageSection>
          <PageSection>
            <Content>
              <p>Transaction submitted!</p>
            </Content>
          </PageSection>
        </>
      )}
      <PageSection>
        <pre>
          {JSON.stringify(
            [payload.nft, payload.tokenId, payload.infuser, payload.dailyRate, payload.totalDays],
            null,
            2
          )}
        </pre>
      </PageSection>
    </>
  );
};
