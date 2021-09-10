import React, { FunctionComponent, useEffect } from 'react';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { Browse } from './components/Browse';
import { Claim } from './components/Claim';
import { Error404 } from './components/Error404';
import { Home } from './components/Home';
import { ManageSQNCRs } from './components/ManageSQNCRs';
import { MintSQNCR } from './components/MintSQNCR';
import { Page } from './components/Page';
import { Profile } from './components/Profile';
import { Protocol } from './components/Protocol';
import { AdminInfusion } from './components/AdminInfusion';
import { SQNCRDetail } from './components/SQNCRDetails';
import { TokenDetail } from './components/TokenDetail';
import { Wallet } from './components/Wallet';
import { Curate } from './components/Curate';
import { InfuseNFTs } from './components/InfuseNFTs';
import { Curators } from './components/Curators';
import { GrantAllowance } from './components/GrantAllowance';
import { Cashgrabbaz } from './components/features/Cashgrabbaz';
import { LoadGate } from './components/LoadGate';
import { Sphynx } from './components/features/Sphynx';

export const Application: FunctionComponent = () => {
  const { pathname } = useLocation();

  // always scroll when nav changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <Page>
      <LoadGate>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/wallet">
            <Wallet />
          </Route>
          <Route exact path="/sqncr">
            <ManageSQNCRs />
          </Route>
          <Route path="/sqncr/mint">
            <MintSQNCR />
          </Route>
          <Route path="/sqncr/:tokenId">
            <SQNCRDetail />
          </Route>
          <Route exact path="/protocol">
            <Protocol />
          </Route>
          <Route exact path="/tokens">
            <Browse />
          </Route>
          <Route path="/tokens/browse">
            <Browse />
          </Route>
          <Route
            exact
            path="/tokens/:tokenId"
            render={(props) => (
              <Redirect to={`/tokens/0x486ca491C9A0a9ACE266AA100976bfefC57A0Dd4/${props.match.params.tokenId}`} />
            )}
          />
          <Route
            exact
            path="/profile/:address"
            render={(props) => <Redirect to={`/profile/${props.match.params.address}/owned`} />}
          />
          <Route path="/profile/:address/:section" component={Profile} />
          <Route exact path="/tokens/:nft/:tokenId/claim">
            <Claim />
          </Route>
          <Route exact path="/tokens/:nft/:tokenId">
            <TokenDetail />
          </Route>
          <Route exact path="/admin-infuse">
            <AdminInfusion />
          </Route>
          <Route exact path="/curate">
            <Curate />
          </Route>
          <Route exact path="/curate/infuse">
            <InfuseNFTs />
          </Route>
          <Route exact path="/curate/curators">
            <Curators />
          </Route>
          <Route exact path="/curate/grant">
            <GrantAllowance />
          </Route>
          <Route exact path="/voidkross/cashgrabbaz">
            <Cashgrabbaz />
          </Route>
          <Route exact path="/jazdaartist/sphynx">
            <Sphynx />
          </Route>
          <Route path="*">
            <Error404 />
          </Route>
        </Switch>
      </LoadGate>
    </Page>
  );
};
