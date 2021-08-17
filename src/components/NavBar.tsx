import { makeStyles } from '@material-ui/styles';
import React, { FunctionComponent, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { ThemeConfig } from '../Theme';
import { Button } from './Button';
import { PageSection } from './PageSection';
import { Vibes } from './Vibes';
import { WalletButton } from './WalletButton';

import { getContracts } from '../contracts';
import { SQNCR } from './SQNCR';
import { useWallet } from '../hooks/wallet';
import { FlashingLabel } from './FlashingLabel';
import { useProtocol } from '../hooks/protocol';

const useStyles = makeStyles<ThemeConfig>((theme) => {
  return {
    section: {
      position: 'fixed',
      width: '100%',
      background: theme.palette.background.main,
      padding: theme.spacing(3.5),
      '@media(min-width: 800px)': { fontSize: theme.spacing(4.5) },
      zIndex: 1000,
    },
    container: {
      display: 'flex',
      alignItems: 'center',
      '& > div:first-child': {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
      },
    },
    navs: {
      display: 'flex',
      '& > *': {
        marginLeft: theme.spacing(4),
      },
    },
    menu: {
      background: theme.palette.background.main,
      fontSize: theme.spacing(4),
      '@media(min-width: 800px)': { fontSize: theme.spacing(5) },
      marginTop: theme.spacing(10),
      minHeight: '100vh',
      textAlign: 'right',
      '& > *': {
        marginBottom: theme.spacing(3),
      },
    },
    onlyDesktop: {
      '@media(max-width: 799px)': { display: 'none' },
    },
  };
});

export const NavBar: FunctionComponent = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const history = useHistory();
  const { activeSQNCR, walletPresent, accountView } = useWallet();
  const { protocolView } = useProtocol();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const withClose = (fn: () => any) => () => {
    setOpen(false);
    fn();
  };

  const isCurator = Boolean(protocolView?.infusionPool.allowances.find((a) => a.address === accountView?.address));

  return (
    <PageSection padding="0" className={classes.section}>
      <div className={classes.container}>
        <div>
          {!open && (
            <>
              <Button>
                <Link to="/">
                  <Vibes accent={false} />
                </Link>
              </Button>
              &nbsp;
              <div className={classes.onlyDesktop}>
                <SQNCR sqncr={activeSQNCR} />
                {activeSQNCR === null && accountView !== null && (
                  <Button navTo="/sqncr/mint">
                    <FlashingLabel label="MINT SQNCR" />
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
        <div className={classes.navs}>
          {!open && <WalletButton />}
          <div>
            <Button onClick={() => setOpen(!open)}>{open ? 'close' : '..'}</Button>
          </div>
        </div>
      </div>
      {open && (
        <div className={classes.menu}>
          <div>
            <Button onClick={withClose(() => history.push('/'))}>🏠 HOME</Button>
          </div>
          <div>
            <Button onClick={withClose(() => history.push('/tokens'))}>🌈 TOKENS</Button>
          </div>
          <div>
            <Button onClick={withClose(() => history.push('/protocol'))}>⚙️ PROTOCOL</Button>
          </div>
          <div>
            <Button onClick={withClose(() => history.push('/wallet'))} disabled={!walletPresent()}>
              🏦 WALLET
            </Button>
          </div>
          <div>
            <Button
              onClick={withClose(() => history.push(`/profile/${accountView?.address}`))}
              disabled={!walletPresent()}
            >
              ⭐️ PROFILE
            </Button>
          </div>
          {isCurator && (
            <div>
              <Button onClick={withClose(() => history.push('/curate'))} disabled={!walletPresent()}>
                🔥 CURATE
              </Button>
            </div>
          )}
          <div>* * *</div>
          <div>
            <Button externalNavTo="https://docs.sickvibes.xyz">📚 DOCS</Button>
          </div>
          <div>
            <Button onClick={() => setOpen(false)} externalNavTo="https://discord.gg/qDrsjcGR2F">
              🗣 DISCORD
            </Button>
          </div>
          <div>
            <Button externalNavTo="https://snapshot.org/#/sickvibes.eth">🗳 SNAPSHOT</Button>
          </div>
          <div>
            <Button
              externalNavTo={`https://quickswap.exchange/#/swap?inputCurrency=ETH&outputCurrency=${
                getContracts().vibes
              }`}
            >
              🤑 BUY <Vibes />
            </Button>
          </div>
        </div>
      )}
    </PageSection>
  );
};
