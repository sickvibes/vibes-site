import React, { FunctionComponent, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTokens } from '../hooks/tokens';
import { useWallet } from '../hooks/wallet';
import { Button } from './Button';
import { ButtonGroup } from './ButtonGroup';
import { Content } from './Content';
import { PageSection } from './PageSection';
import { Title } from './Title';
import { Vibes } from './Vibes';
import { Claimer } from './Claimer';
import { BigNumber, ContractTransaction } from 'ethers';
import { Divider } from './Divder';
import { claimFromNft, nftViewId } from '../web3/wellspringv2';

interface Params {
  nft: string;
  tokenId: string;
}

export const Claim: FunctionComponent = () => {
  const { nft, tokenId } = useParams<Params>();
  const [trx, setTrx] = useState<null | ContractTransaction>(null);
  const { tokens } = useTokens();
  const { account, library, registerTransactions } = useWallet();

  const token = tokens.find((t) => nftViewId(t) === nftViewId({ tokenId, nft }));

  const onClaim = async (amount: BigNumber) => {
    const resp = await claimFromNft(token, amount, library.getSigner());
    setTrx(resp);
    registerTransactions(resp);
    return resp;
  };

  if (!token || !token.isInfused) {
    return (
      <PageSection>
        <Content>
          <Title>Invalid Token</Title>
          <p>⚠️ This token is not a VIBES NFT.</p>
        </Content>
      </PageSection>
    );
  }

  if (trx) {
    return (
      <>
        <PageSection>
          <Title>
            😎 score some <Vibes /> 😎
          </Title>
        </PageSection>
        <PageSection>
          <Content>
            <p>
              Claim transaction submitted! Your <Vibes /> are on the way.
            </p>
            <ButtonGroup>
              <Button navTo={`/tokens/${token.nft}/${token.tokenId}`}>🖼 BACK to NFT</Button>
              <Button externalNavTo={`https://polygonscan.com/tx/${trx.hash}`}>🔎 VIEW on Polygonscan</Button>
            </ButtonGroup>
          </Content>
        </PageSection>
        <Divider />
      </>
    );
  }

  return (
    <>
      <PageSection>
        <Title>
          😎 score some <Vibes /> 😎
        </Title>
      </PageSection>
      {token.owner !== account && (
        <PageSection>
          <Content>
            <p>
              You are not the owner of this token. Only the current owner of an NFT can claim the <Vibes /> staked
              inside it.
            </p>
            <ButtonGroup>
              <Button navTo={`/tokens/${token.tokenId}`}>BACK</Button>
            </ButtonGroup>
          </Content>
        </PageSection>
      )}
      {token.owner === account && (
        <>
          <PageSection>
            <Claimer tokenId={token.tokenId} onClaim={onClaim} />
          </PageSection>
          <PageSection>
            <Content>
              <p>
                This will <strong>PERMANENTLY</strong> claim the input amount of <Vibes /> from this NFT to your wallet.
                More <Vibes /> will continue to be mined after claiming.
              </p>
              <ButtonGroup>
                <Button navTo={`/tokens/${token.nft}/${token.tokenId}`}>🙅 CANCEL</Button>
              </ButtonGroup>
            </Content>
          </PageSection>
        </>
      )}
      <PageSection>
        <Divider />
      </PageSection>
    </>
  );
};
