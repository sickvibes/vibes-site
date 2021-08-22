import React, { FunctionComponent } from 'react';
import { useParams } from 'react-router-dom';

import { Content } from './Content';
import { PageSection } from './PageSection';
import { Title } from './Title';

import { nftViewId } from '../web3/wellspringv2';
import { TwoPanel } from './TwoPanel';
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
                  tokenView.balance
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
                  interoplate={{ dailyRate: tokenView.dailyRate, sampledAt: tokenView.sampledAt }}
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
                <Button externalNavTo={`https://www.screensaver.world/object/${tokenView.tokenId}`}>
                  🌌 VIEW on screensaver
                </Button>
                <Button externalNavTo={`https://opensea.io/assets/matic/${tokenView.nft}/${tokenView.tokenId}`}>
                  ⛵️ VIEW on OpenSea
                </Button>
              </ButtonGroup>
            </Content>
          </div>
        </TwoPanel>
      </PageSection>
      <PageSection>
        <Divider />
      </PageSection>
    </>
  );
};
