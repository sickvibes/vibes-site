import React, { FunctionComponent } from 'react';
import { useParams } from 'react-router-dom';

import { Content } from './Content';
import { PageSection } from './PageSection';
import { Title } from './Title';

import { nftViewId } from '../web3/wellspringv2';
import { TwoPanel } from './TwoPanel';
import { TokenGrid } from './TokenGrid';
import { Address } from './Address';
import { makeStyles } from '@material-ui/styles';
import { ThemeConfig } from '../Theme';
import { DecimalNumber } from './DecimalNumber';
import { Vibes } from './Vibes';
import { ButtonGroup } from './ButtonGroup';
import { Button } from './Button';
import { extractFlavorText, formatBytes, prettyPrintDays } from '../lib/strings';
import { Stats } from './Stats';
import { Divider } from './Divder';
import { useWallet } from '../hooks/wallet';
import { TokenCard } from './TokenCard';
import { useTokens } from '../hooks/tokens';
import { sample } from '../lib/random';
import { resolveExternalLink } from '../web3/external-link';
import { BigNumber } from 'ethers';

interface Params {
  nft: string;
  tokenId: string;
}

const useStyles = makeStyles<ThemeConfig>((theme) => {
  return {
    hero: {
      display: 'flex',
      justifyContent: 'center',
      '& > div': {
        marginTop: theme.spacing(6),
      },
    },
  };
});

export const TokenDetail: FunctionComponent = () => {
  const { account } = useWallet();
  const { tokenId, nft } = useParams<Params>();
  const { tokens, getMetadata } = useTokens();
  const classes = useStyles();

  const tokenView = tokens.find((t) => nftViewId(t) === nftViewId({ tokenId, nft }));

  if (!tokenView) {
    return (
      <PageSection>
        <Content>
          <Title>Invalid Token</Title>
          <p>⚠️ This token is not a VIBES NFT.</p>
          <ButtonGroup>
            <Button externalNavTo={`https://opensea.io/assets/matic/${nft}/${tokenId}`}>⛵️ VIEW on OpenSea</Button>
          </ButtonGroup>
        </Content>
      </PageSection>
    );
  }

  const metadata = getMetadata(tokenView);

  if (metadata == null) {
    return (
      <PageSection>
        <Content>
          <Title>⌛️ LOADING METADATA</Title>
        </Content>
      </PageSection>
    );
  }

  const viewId = nftViewId(tokenView);

  const byArtist = tokens.filter((t) => getMetadata(t)?.creator === metadata.creator && nftViewId(t) !== viewId);
  const byCurator = tokens.filter(
    (t) => t.infuser === tokenView.infuser && t.infuser !== getMetadata(t)?.creator && nftViewId(t) !== viewId
  );
  const byCollector = tokens.filter(
    (t) => t.owner === tokenView.owner && t.infuser !== t.owner && nftViewId(t) !== viewId
  );

  const moreByArtist = sample(byArtist, 3, viewId);
  const moreFromCurator = sample(byCurator, 3, viewId);
  const moreFromCollector = sample(byCollector, 3, viewId);

  const externaLink = resolveExternalLink(tokenView);

  return (
    <>
      <PageSection>
        <div className={classes.hero}>
          <div>
            <TokenCard view={tokenView} />
          </div>
        </div>
      </PageSection>
      <PageSection>
        <Content>
          <div>
            <Title align="left">{metadata.name}</Title>
            <p>{extractFlavorText(metadata.description)}</p>
          </div>
        </Content>
      </PageSection>
      <PageSection>
        <TwoPanel>
          <div>
            <Content>
              <Stats>
                {metadata.creator && (
                  <>
                    <strong>🎨 artist:</strong>{' '}
                    <Button navTo={`/profile/${metadata.creator}/created`}>
                      <Address address={metadata.creator} />
                    </Button>
                    <br />
                  </>
                )}
                <strong>🔥 curated by:</strong>{' '}
                <Button navTo={`/profile/${tokenView.infuser}/infused`}>
                  <Address address={tokenView.infuser} />
                </Button>
                <br />
                <strong>🌈 collector:</strong>{' '}
                <Button navTo={`/profile/${tokenView.owner}/owned`}>
                  <Address address={tokenView.owner} />
                </Button>
                <br />
                <strong>✨ infused:</strong> <DecimalNumber number={tokenView.balance} decimals={0} /> <Vibes /> (
                {prettyPrintDays(
                  tokenView.dailyRate.eq(0)
                    ? 0
                    : tokenView.balance
                        .mul(60 * 60 * 24)
                        .div(tokenView.dailyRate)
                        .toNumber()
                )}
                )
                <br />
                <strong>😎 claimable:</strong>{' '}
                <DecimalNumber
                  number={tokenView.claimable}
                  decimals={3}
                  interoplate={{
                    dailyRate: tokenView.dailyRate,
                    sampledAt: tokenView.sampledAt,
                    max: tokenView.balance,
                  }}
                />{' '}
                <Vibes />
                <br />
                <strong>💎 mining:</strong> <DecimalNumber number={tokenView.dailyRate} decimals={0} /> <Vibes /> / day
                <br />
                {metadata.media && (
                  <>
                    <strong>🖼 media:</strong> {metadata.media.mimeType} {formatBytes(metadata.media.size)}
                  </>
                )}
              </Stats>
            </Content>
          </div>
          <div>
            <Content>
              <ButtonGroup>
                <Button
                  disabled={tokenView.owner !== account}
                  navTo={`/tokens/${tokenView.nft}/${tokenView.tokenId}/claim`}
                >
                  😎 CLAIM <Vibes />
                </Button>
                {externaLink.name !== 'OpenSea' && (
                  <Button externalNavTo={externaLink.url}>🌌 VIEW on {externaLink.name}</Button>
                )}
                <Button externalNavTo={`https://opensea.io/assets/matic/${tokenView.nft}/${tokenView.tokenId}`}>
                  ⛵️ VIEW on OpenSea
                </Button>
              </ButtonGroup>
            </Content>
          </div>
        </TwoPanel>
      </PageSection>
      <PageSection>
        <Content>
          {(moreByArtist.length && metadata && (
            <>
              <div>
                <Title align="left">
                  More Created By <Address address={metadata.creator} />
                </Title>
                <TokenGrid views={moreByArtist} detailed />
              </div>
              <ButtonGroup>
                <Button navTo={`/profile/${metadata.creator}/created`}>
                  🎨 Browse NFTs created by <Address address={metadata.creator} />
                </Button>
              </ButtonGroup>
            </>
          )) ||
            null}
          {(moreFromCurator.length && metadata && (
            <>
              <div>
                <Title align="left">
                  More Curated By <Address address={tokenView.infuser} />
                </Title>
                <TokenGrid views={moreFromCurator} detailed />
              </div>
              <ButtonGroup>
                <Button navTo={`/profile/${tokenView.infuser}/curated`}>
                  🔥 Browse NFTs curated by <Address address={tokenView.infuser} />
                </Button>
              </ButtonGroup>
            </>
          )) ||
            null}
          {(moreFromCollector.length && metadata && (
            <>
              <div>
                <Title align="left">
                  More Collected By <Address address={tokenView.owner} />
                </Title>
                <TokenGrid views={moreFromCollector} detailed />
              </div>
              <ButtonGroup>
                <Button navTo={`/profile/${tokenView.owner}/owned`}>
                  🌈 Browse NFTs collected by <Address address={tokenView.owner} />
                </Button>
              </ButtonGroup>
            </>
          )) ||
            null}
        </Content>
      </PageSection>
      <PageSection>
        <Divider />
      </PageSection>
    </>
  );
};
