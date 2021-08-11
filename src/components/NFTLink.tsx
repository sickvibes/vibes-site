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

const whalesSpottedInTheWild = [
  '0xA186727FDAF90cD7d9972572E32C618Ce04206f8',
  '0xd48D8cef2F1A7b29BAFb5E17e8B88bfEBaeC602a',
];

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
