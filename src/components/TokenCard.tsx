import { makeStyles } from '@material-ui/styles';
import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { ThemeConfig } from '../Theme';
import { NFTView } from '../web3/wellspringv2';
import { DecimalNumber } from './DecimalNumber';
import { NFTLink } from './NFTLink';
import { Address } from './Address';
import { Button } from './Button';
import { useTokens } from '../hooks/tokens';
import { restrictedIpfsGatewayUrl } from '../lib/ipfs';

interface Props {
  view: NFTView;
  detailed?: boolean;
}

const useStyles = makeStyles<ThemeConfig>((theme) => {
  return {
    token: {
      fontSize: theme.spacing(4),
      display: 'grid',
      gap: theme.spacing(2),
    },
    media: {
      '@media(min-width: 800px)': {
        maxWidth: '50vh',
      },
      '& img': {
        width: '100%',
      },
      '& video': {
        width: '100%',
      },
    },
    top: {
      display: 'grid',
      gridTemplateColumns: '1fr auto',
    },
  };
});

export const TokenCard: FunctionComponent<Props> = ({ view, detailed }) => {
  const classes = useStyles();
  const { getMetadata } = useTokens();

  const metadata = getMetadata(view);

  if (!metadata) {
    return null;
  }

  return (
    <>
      <div className={classes.token}>
        <div className={classes.media}>
          <Link to={`/tokens/${view.nft}/${view.tokenId}`}>
            {!metadata.animation_url && <img src={restrictedIpfsGatewayUrl(metadata.image)} />}
            {metadata.animation_url && (
              <video autoPlay muted loop controls={false}>
                <source src={restrictedIpfsGatewayUrl(metadata.animation_url)} />
              </video>
            )}
          </Link>
        </div>
        <div className={classes.info}>
          <div className={classes.top}>
            <div>
              <DecimalNumber
                number={view.claimable}
                decimals={3}
                interoplate={{ sampledAt: view.sampledAt, dailyRate: view.dailyRate, max: view.balance }}
              />{' '}
              VIBES
            </div>
            <div>
              <NFTLink view={view} />
            </div>
          </div>
          {detailed && (
            <div>
              <div>{metadata.name}</div>
              {metadata.creator && (
                <div>
                  <Button navTo={`/profile/${metadata.creator}/created`}>
                    <Address address={metadata.creator} />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
