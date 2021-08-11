import React, { FunctionComponent } from 'react';
import { Route, Switch, useParams, RouteComponentProps, NavLink } from 'react-router-dom';
import { PageSection } from './PageSection';
import { Address } from './Address';
import { Content } from './Content';
import { Title } from './Title';
import { Vibes } from './Vibes';
import { useTokens } from '../hooks/tokens';
import { makeStyles } from '@material-ui/styles';
import { ThemeConfig } from '../Theme';
import { TokenGrid } from './TokenGrid';
import { Divider } from './Divder';

interface Params {
  address: string;
}

const useStyles = makeStyles<ThemeConfig>((theme) => {
  return {
    link: {
      color: theme.palette.foreground.dark,
      fontSize: theme.spacing(4),
      '@media(min-width:800px)': {
        fontSize: theme.spacing(5),
      },
      '&:hover': {
        background: theme.palette.accent.dark,
        color: theme.palette.foreground.main,
      },
    },
    active: {
      color: theme.palette.foreground.main,
    },
  };
});

export const Profile: FunctionComponent<RouteComponentProps> = (props) => {
  const { address } = useParams<Params>();
  const { tokens, getMetadata } = useTokens();
  const classes = useStyles(props);

  if (tokens == null) {
    return (
      <PageSection>
        <Content>
          <Title>⌛️ LOADING TOKENS</Title>
        </Content>
      </PageSection>
    );
  }

  const owned = tokens?.filter((t) => t.owner === address) ?? [];
  const infused = tokens?.filter((t) => t.infuser === address) ?? [];
  const created = tokens?.filter((t) => getMetadata(t)?.creator === address) ?? [];

  return (
    <>
      <PageSection>
        <Content>
          <Title>
            <Address address={address} />
            's <Vibes /> Profile
          </Title>
        </Content>
      </PageSection>

      <PageSection>
        [
        <NavLink to={`./owned`} className={classes.link} activeClassName={classes.active}>
          OWNED
        </NavLink>
        ] [
        <NavLink to={`./created`} className={classes.link} activeClassName={classes.active}>
          CREATED
        </NavLink>
        ] [
        <NavLink to={`./infused`} className={classes.link} activeClassName={classes.active}>
          INFUSED
        </NavLink>
        ]
      </PageSection>
      <PageSection>
        <Switch>
          <Route path={`/profile/:address/owned`}>
            <TokenGrid views={owned} detailed />
          </Route>
          <Route path={`/profile/:address/created`}>
            <TokenGrid views={created} detailed />
          </Route>
          <Route path={`/profile/:address/infused`}>
            <TokenGrid views={infused} detailed />
          </Route>
        </Switch>
      </PageSection>
      <PageSection>
        <Divider />
      </PageSection>
    </>
  );
};
