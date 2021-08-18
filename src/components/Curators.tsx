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

  const allowances = protocolView?.infusionPool.allowances.filter((a) => a.amount.gt(0)) ?? [];

  return (
    <>
      <PageSection>
        <Content>
          <Title>Curators</Title>
          <p>
            Curators have the ability to to infuse NFTs in their wallet with <Vibes /> that can be mined by collectors.
          </p>
          <table>
            <thead>
              <tr className={classes.header}>
                <th>curator</th>
                <th>allowance</th>
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
                    <DecimalNumber number={a.amount} decimals={0} /> <Vibes />
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
