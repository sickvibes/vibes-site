import React, { FunctionComponent } from 'react';
import { PageSection } from './PageSection';
import { Content } from './Content';
import { Title } from './Title';
import { useTokens } from '../hooks/tokens';
import { TokenGrid } from './TokenGrid';
import { Divider } from './Divder';
import { Button } from './Button';
import { Route, Switch } from 'react-router-dom';
import { shuffle } from '../lib/random';

export const Nav: FunctionComponent<{ title: string }> = (props) => {
  return (
    <>
      <PageSection>
        <Content>
          <Title>{props.title}</Title>
        </Content>
        <Content>
          <p style={{ textAlign: 'center' }}>
            <Button navTo="/tokens/browse/for-sale-by-artist">🎨</Button>{' '}
            <Button navTo="/tokens/browse/for-sale-by-curator">🔥</Button>{' '}
            <Button navTo="/tokens/browse/for-sale-by-collector">🌈</Button>{' '}
            <Button navTo="/tokens/browse/buy-now">⚡️</Button> <Button navTo="/tokens/browse/for-sale">🤑</Button>
          </p>
        </Content>
      </PageSection>
    </>
  );
};

export const Browse: FunctionComponent = () => {
  const { tokens, getMetadata, getSaleInfo } = useTokens();

  const forSale = tokens.filter((t) => getSaleInfo(t)?.forSale);
  const forSaleByArtist = forSale.filter((t) => getMetadata(t)?.creator === t.owner);
  const forSaleByCurator = forSale.filter((t) => getMetadata(t)?.creator !== t.owner && t.infuser === t.owner);
  const forSaleByCollector = forSale.filter((t) => getMetadata(t)?.creator !== t.owner && t.infuser !== t.owner);
  const buyNow = tokens
    .filter((t) => getSaleInfo(t)?.tokenPrice?.gt(0))
    .sort((a, b) => (getSaleInfo(a)?.tokenPrice.lte(getSaleInfo(b).tokenPrice) ? -1 : 1));

  return (
    <>
      <Switch>
        <Route exact path="/tokens">
          <Nav title="All VIBES Art" />
          <PageSection>
            <TokenGrid views={tokens} detailed />
          </PageSection>
        </Route>
        <Route exact path="/tokens/browse/for-sale">
          <Nav title="VIBES Art For Sale" />
          <PageSection>
            <TokenGrid views={shuffle(forSale)} detailed />
          </PageSection>
        </Route>
        <Route exact path="/tokens/browse/for-sale-by-artist">
          <Nav title="VIBES Art For Sale By Artist" />
          <PageSection>
            <TokenGrid views={shuffle(forSaleByArtist)} detailed />
          </PageSection>
        </Route>
        <Route exact path="/tokens/browse/for-sale-by-curator">
          <Nav title="VIBES Art For Sale By Curator" />
          <PageSection>
            <TokenGrid views={shuffle(forSaleByCurator)} detailed />
          </PageSection>
        </Route>
        <Route exact path="/tokens/browse/for-sale-by-collector">
          <Nav title="VIBES Art For Sale By Collector" />
          <PageSection>
            <TokenGrid views={shuffle(forSaleByCollector)} detailed />
          </PageSection>
        </Route>
        <Route exact path="/tokens/browse/buy-now">
          <Nav title="VIBES Art - Buy Now" />
          <PageSection>
            <TokenGrid views={buyNow} detailed />
          </PageSection>
        </Route>
      </Switch>

      <PageSection>
        <Divider />
      </PageSection>
    </>
  );
};
