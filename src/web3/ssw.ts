import { BigNumber } from 'ethers';
import { Provider, Contract as MulticallContract } from 'ethers-multicall';
import { getContracts } from '../contracts';
import { getProvider } from '../lib/rpc';
import SSW from './abi/ssw.json';

export interface TokenSale {
  nft: string;
  tokenId: string;
  forSale: boolean;
  currentBid?: {
    bid: BigNumber;
    bidder: string;
  };
}

export const batchGetAuctionInfo = async (tokenIds: string[]): Promise<TokenSale[]> => {
  const provider = new Provider(getProvider(), 137);
  const sswAddress = getContracts().ssw;
  const ssw = new MulticallContract(sswAddress, SSW);
  const results = await provider.all([
    ...tokenIds.map((id) => ssw.getApproved(id)),
    ...tokenIds.map((id) => ssw.currentBidDetailsOfToken(id)),
  ]);

  const info: TokenSale[] = [];
  for (let i = 0; i < tokenIds.length; i++) {
    const details = results[i + tokenIds.length];
    const forSale = results[i] === sswAddress;
    let currentBid: TokenSale['currentBid'];
    if (forSale && !details[0].eq(0)) {
      currentBid = {
        bid: details[0],
        bidder: details[1],
      };
    }

    info.push({
      nft: sswAddress,
      tokenId: tokenIds[i],
      forSale,
      currentBid,
    });
  }

  return info;
};
