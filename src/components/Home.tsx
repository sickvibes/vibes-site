import React, { FunctionComponent, useEffect, useState } from 'react';
import { Content } from './Content';
import { PageSection } from './PageSection';
import { Title } from './Title';
import { TwoPanel } from './TwoPanel';
import { Vibes } from './Vibes';
import { ButtonGroup } from './ButtonGroup';
import { Button } from './Button';
import { TokenCard } from './TokenCard';
import { Divider } from './Divder';
import { makeStyles } from '@material-ui/styles';
import { ThemeConfig } from '../Theme';
import { TokenGrid } from './TokenGrid';
import { useTokens } from '../hooks/tokens';
import { NftBag } from '../lib/nft';
import { NFTView } from '../web3/wellspringv2';
import shuffle from 'lodash/shuffle';

const useStyles = makeStyles<ThemeConfig>((theme) => {
  return {
    cta: {
      '@media(max-width: 799px)': {
        minHeight: '70vh',
        display: 'grid',
        alignItems: 'center',
      },
    },
    hero: {
      '@media(min-width: 800px)': {
        marginTop: theme.spacing(10),
      },
    },
  };
});

interface HomeView {
  featured: NFTView;
  recentForSale: NFTView[];
  recent: NFTView[];
}

export const Home: FunctionComponent = () => {
  const classes = useStyles();
  const { tokens, getSaleInfo, status } = useTokens();
  const [view, setView] = useState<'loading' | HomeView>('loading');

  useEffect(() => {
    if (status !== 'ready') return;
    const bag = new NftBag(tokens);

    // featured is a random for-sale token
    let featured = bag.takeWhere((t) => getSaleInfo(t)?.forSale);

    // if none for sale, its any token
    if (!featured) {
      featured = bag.takeAny();
    }

    // all recent for sale stuff not featured
    const recentForSale = shuffle(tokens.filter((t) => getSaleInfo(t)?.forSale && bag.exists(t)));
    // const total = recentForSale.reduce((acc, t) => acc.add(getSaleInfo(t)?.currentBid?.bid ?? 0), BigNumber.from(0));
    // console.log(formatUnits(total));

    recentForSale.forEach((t) => bag.take(t));

    const recent = tokens.filter((t) => bag.exists(t)).slice(0, 6);
    recent.forEach((t) => bag.take(t));

    setView({
      featured,
      recentForSale,
      recent,
    });
  }, [tokens, status]);

  if (view === 'loading') {
    return null;
  }

  return (
    <>
      <div className={classes.hero}>
        <PageSection>
          <TwoPanel alignItems="center">
            <div className={classes.cta}>
              <Content>
                <Title>😎 Welcome to VIBES</Title>
                <p>
                  <Vibes /> is a decentralized digital art collective and cryptonetwork on the Polygon blockchain.
                </p>
                <p>
                  We're a community of artists, collectors, and builders who want to ship cool stuff and make killer
                  art.
                </p>
                <ButtonGroup>
                  <Button navTo="/tokens">🌈 BROWSE ART</Button>
                  <Button externalNavTo="https://docs.sickvibes.xyz">🚀 LEARN MORE</Button>
                </ButtonGroup>
                <p> </p>
              </Content>
            </div>
            <div>
              <Content>
                <TokenCard detailed view={view.featured} />
                {getSaleInfo(view.featured)?.forSale && (
                  <ButtonGroup>
                    <Button>🔥 BID on Screensaver</Button>
                  </ButtonGroup>
                )}
              </Content>
            </div>
          </TwoPanel>
        </PageSection>
      </div>
      {view.recentForSale.length > 0 && (
        <PageSection>
          <Content>
            <Title>🔥 VIBES NFTs For Sale</Title>
            <TokenGrid detailed views={view.recentForSale} />
          </Content>
        </PageSection>
      )}
      {/* <PageSection>
        <Content>
          <Title>🌈 Recent VIBES NFTs</Title>
          <TokenGrid detailed views={view.recent} />
        </Content>
      </PageSection> */}
      <PageSection>
        <Divider />
      </PageSection>
    </>
  );
};
