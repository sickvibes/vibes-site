import { makeStyles } from '@material-ui/styles';
import { BigNumber } from 'ethers';
import React, { FunctionComponent } from 'react';
import { getContracts } from '../contracts';
import { useTokens } from '../hooks/tokens';
import { ThemeConfig } from '../Theme';
import { NFTView } from '../web3/wellspringv2';
import { Button } from './Button';
import { DecimalNumber } from './DecimalNumber';
import { FlashingLabel } from './FlashingLabel';
import { useWallet } from '../hooks/wallet';
import { resolveExternalLink } from '../web3/external-link';

interface Props {
  view: NFTView;
}

const useStyles = makeStyles<ThemeConfig>((theme) => {
  return {
    tag: {
      color: theme.palette.foreground.dark,
    },
  };
});

export const NFTLink: FunctionComponent<Props> = ({ view }) => {
  const { getSaleInfo } = useTokens();
  const { account } = useWallet();
  const classes = useStyles();

  const externaLink = resolveExternalLink(view);
  const saleInfo = getSaleInfo(view);

  if (saleInfo.tokenPrice?.gt(0)) {
    return (
      <Button externalNavTo={externaLink.url}>
        <FlashingLabel accent="secondary">
          ⚡️
          <DecimalNumber number={saleInfo.tokenPrice} decimals={2} /> MATIC
        </FlashingLabel>
      </Button>
    );
  }

  if (saleInfo?.forSale) {
    const bidder = saleInfo.currentBid?.bidder;
    return (
      <Button externalNavTo={externaLink.url}>
        <FlashingLabel accent={bidder && account === bidder ? 'main' : undefined}>
          <DecimalNumber number={saleInfo.currentBid?.bid ?? BigNumber.from(0)} decimals={2} /> MATIC
        </FlashingLabel>
      </Button>
    );
  }

  return (
    <Button externalNavTo={externaLink.url}>
      <span className={classes.tag}>{externaLink.symbol ?? ''}</span>#{view.tokenId}
    </Button>
  );
};
