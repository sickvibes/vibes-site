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
  forSaleByArtist: NFTView[];
  forSaleByCurator: NFTView[];
  forSaleByCollector: NFTView[];
  recent: NFTView[];
}

export const Home: FunctionComponent = () => {
  const classes = useStyles();
  const { tokens, getSaleInfo, status, getMetadata } = useTokens();
  const [view, setView] = useState<'loading' | HomeView>('loading');

  useEffect(() => {
    if (status !== 'ready') return;

    const byArtist = tokens.filter((t) => getMetadata(t)?.creator === t.owner);
    const byCurator = tokens.filter((t) => t.owner === t.infuser && getMetadata(t)?.creator !== t.owner);
    const byCollector = tokens.filter((t) => getMetadata(t)?.creator !== t.owner && t.owner !== t.infuser);

    const byArtistBag = new NftBag(byArtist);
    const byCuratorBag = new NftBag(byCurator);
    const byCollectorBag = new NftBag(byCollector);

    // featured is a random for-sale token
    const featured =
      byArtistBag.takeWhere((t) => getSaleInfo(t)?.forSale) ??
      byCuratorBag.takeWhere((t) => getSaleInfo(t)?.forSale) ??
      byCollectorBag.takeWhere((t) => getSaleInfo(t)?.forSale) ??
      byArtistBag.takeAny() ??
      byCuratorBag.takeAny() ??
      byCollectorBag.takeAny();

    setView({
      featured,
      forSaleByArtist: byArtistBag.takeManyWhere(6, (t) => getSaleInfo(t)?.forSale),
      forSaleByCurator: byCuratorBag.takeManyWhere(6, (t) => getSaleInfo(t)?.forSale),
      forSaleByCollector: byCollectorBag.takeManyWhere(6, (t) => getSaleInfo(t)?.forSale),
      recent: [],
    });
  }, [tokens, status, getSaleInfo, getMetadata]);

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
      {view.forSaleByArtist.length > 0 && (
        <PageSection>
          <Content>
            <Title>🎨 VIBES NFTs for sale by ARTIST</Title>
            <TokenGrid detailed views={view.forSaleByArtist} />
          </Content>
        </PageSection>
      )}
      {view.forSaleByCurator.length > 0 && (
        <PageSection>
          <Content>
            <Title>🔥 VIBES NFTs for sale by CURATOR</Title>
            <TokenGrid detailed views={view.forSaleByCurator} />
          </Content>
        </PageSection>
      )}
      {view.forSaleByCollector.length > 0 && (
        <PageSection>
          <Content>
            <Title>🖼 VIBES NFTs for sale by COLLECTOR</Title>
            <TokenGrid detailed views={view.forSaleByCollector} />
          </Content>
        </PageSection>
      )}
      <PageSection>
        <Divider />
      </PageSection>
    </>
  );
};
