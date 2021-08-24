import { makeStyles } from '@material-ui/styles';
import React, { FunctionComponent } from 'react';
import { useProtocol } from '../hooks/protocol';
import { ThemeConfig } from '../Theme';
import { Address } from './Address';
import { Button } from './Button';
import { ButtonGroup } from './ButtonGroup';
import { Content } from './Content';
import { DecimalNumber } from './DecimalNumber';
import { PageSection } from './PageSection';
import { Title } from './Title';
import { Vibes } from './Vibes';
import { useTokens } from '../hooks/tokens';

const useStyles = makeStyles<ThemeConfig>((theme) => {
  return {
    header: {
      fontWeight: 'bold',
      color: theme.palette.accent.secondary,
      textAlign: 'left',
    },
  };
});

export const Curators: FunctionComponent = () => {
  const classes = useStyles();
  const { protocolView } = useProtocol();
  const { tokens, getMetadata } = useTokens();

  const allowances = protocolView?.infusionPool.allowances.filter((a) => a.amount.gt(0)) ?? [];

  return (
    <>
      <PageSection>
        <Content>
          <Title>Curators</Title>
          <p>
            🔥 Curators can infuse any NFT they own with <Vibes /> that can be mined by collectors.
          </p>
          <p>
            🌱 Each curator has a certain amount of <em>influence</em> that can be spent to curate NFTs, or transfered
            to another address to onboard other curators.
          </p>
          <table>
            <thead>
              <tr className={classes.header}>
                <th>CURATOR</th>
                <th>INFLUENCE</th>
                <th>INFUSED NFTs</th>
                <th>CURATED NFTs</th>
              </tr>
            </thead>
            <tbody>
              {allowances.map((a) => (
                <tr key={a.address}>
                  <td>
                    <Button navTo={`/profile/${a.address}`}>
                      <Address address={a.address} />
                    </Button>
                  </td>
                  <td>
                    <DecimalNumber number={a.amount} decimals={0} />
                  </td>
                  <td>
                    {tokens.filter((t) => t.infuser === a.address && getMetadata(t)?.creator === a.address).length}
                  </td>
                  <td>
                    {tokens.filter((t) => t.infuser === a.address && getMetadata(t)?.creator !== a.address).length}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <ButtonGroup>
            <Button navTo="/curate">DONE</Button>
          </ButtonGroup>
        </Content>
      </PageSection>
    </>
  );
};
