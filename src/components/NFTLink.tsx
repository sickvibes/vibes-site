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
import { whalesSpottedInTheWild } from '../whales';

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
  const classes = useStyles();

  if (view.nft === getContracts().ssw) {
    const saleInfo = getSaleInfo(view);
    if (saleInfo?.forSale) {
      return (
        <Button externalNavTo={`https://www.screensaver.world/object/${view.tokenId}`}>
          <FlashingLabel>
            {whalesSpottedInTheWild.includes(saleInfo.currentBid?.bidder) && <>🐳</>}
            <DecimalNumber number={saleInfo.currentBid?.bid ?? BigNumber.from(0)} decimals={2} /> MATIC
          </FlashingLabel>
        </Button>
      );
    }
    return (
      <Button externalNavTo={`https://www.screensaver.world/object/${view.tokenId}`}>
        <span className={classes.tag}>ssw</span>#{view.tokenId}
      </Button>
    );
  }

  return <Button externalNavTo={`https://opensea.io/assets/matic/${view.nft}/${view.tokenId}`}>#{view.tokenId}</Button>;
};
