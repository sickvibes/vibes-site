import { BigNumber } from 'ethers';
import { Provider, Contract as MulticallContract } from 'ethers-multicall';
import { getContracts } from '../contracts';
import { getProvider } from '../lib/rpc';
import SSW from './abi/ssw.json';
import SSW_V0 from './abi/ssw-v0.json';
import { Token } from './wellspringv2';

export interface TokenSale {
  nft: string;
  tokenId: string;
  forSale: boolean;
  currentBid?: {
    bid: BigNumber;
    bidder: string;
  };
  tokenPrice?: BigNumber;
}

export const batchGetAuctionInfo = async (tokens: Token[]): Promise<TokenSale[]> => {
  const provider = new Provider(getProvider(), 137);

  const sswAddress = getContracts().ssw;
  const sswV0Address = getContracts().sswv0;
  const ssw = new MulticallContract(sswAddress, SSW);
  const sswV0 = new MulticallContract(sswV0Address, SSW_V0);

  const results = await provider.all([
    ...tokens.map(({ nft, tokenId }) => (nft === sswAddress ? ssw : sswV0).getApproved(tokenId)),
    ...tokens.map(({ nft, tokenId }) => (nft === sswAddress ? ssw : sswV0).currentBidDetailsOfToken(tokenId)),
    ...tokens.map(({ nft, tokenId }) => (nft === sswAddress ? ssw : sswV0).tokenPrice(tokenId)),
  ]);

  const info: TokenSale[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const details = results[i + tokens.length];
    const price = results[i + tokens.length * 2];
    const forSale = results[i] === tokens[i].nft;
    let currentBid: TokenSale['currentBid'];

    if (forSale && !details[0].eq(0)) {
      currentBid = {
        bid: details[0],
        bidder: details[1],
      };
    }

    info.push({
      ...tokens[i],
      forSale,
      currentBid,
      tokenPrice: price ?? BigNumber.from(0),
    });
  }

  return info;
};
