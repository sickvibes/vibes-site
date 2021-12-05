import { BigNumber, ContractTransaction, Signer, Contract } from 'ethers';
import { Provider, Contract as MulticallContract } from 'ethers-multicall';
import { getContracts } from '../contracts';
import { getProvider } from '../lib/rpc';
import WELLSPRING from './abi/wellspring.json';
import WELLSPRING_V2 from './abi/wellspring-v2.json';

export interface Token {
  nft: string;
  tokenId: string;
}

export interface NFTView {
  nft: string;
  tokenId: string;

  unlocksAt: number;
  owner: string;
  tokenUri: string;

  infuser: string;
  operator: string;
  infusedAt: number;
  dailyRate: BigNumber;
  isLegacyToken: boolean;
  balance: BigNumber;
  lastClaimAt: number;

  claimable: BigNumber;
  isInfused: boolean;

  sampledAt: number;
  claimed: BigNumber;
  estimatedOriginalInfusedAmount: BigNumber;
}

export const nftViewId = (view: Token): string => `${view.nft}:${view.tokenId}`;

export const getNFTDetails = async (tokens: Token[]): Promise<(NFTView | null)[]> => {
  const provider = new Provider(getProvider(), 137);
  const wellspringV2 = new MulticallContract(getContracts().wellspringV2, WELLSPRING_V2);
  const [...views] = await provider.all([...tokens.map((t) => wellspringV2.getToken(t.nft, t.tokenId))]);

  const now = Math.round(Date.now() / 1000);

  const projected = views.map<NFTView | null>((v) => {
    if (!v.isValidToken) return null;

    const claimed = v.lastClaimAt
      .sub(v.seededAt)
      .mul(v.dailyRate)
      .div(60 * 60 * 24);

    return {
      nft: v.nft,
      tokenId: v.tokenId.toString(),

      unlocksAt: v.unlocksAt.toNumber(),
      owner: v.owner,
      tokenUri: v.tokenURI,

      infuser: v.seeder,
      operator: v.operator,
      infusedAt: v.seededAt.toNumber(),
      dailyRate: v.balance.eq(0) ? BigNumber.from(0) : v.dailyRate,
      isLegacyToken: v.isLegacyToken,
      balance: v.balance,
      lastClaimAt: v.lastClaimAt.toNumber(),

      claimable: v.claimable,
      isInfused: v.isSeeded,

      sampledAt: now,
      claimed,
      estimatedOriginalInfusedAmount: claimed.add(v.balance),
    };
  });

  return projected;
};

interface RecentTokens {
  limit?: number;
  offset?: number;
  infuser?: string;
}

interface GetRecentTokens {
  views: NFTView[];
  isLastPage: boolean;
}

export const getRecentTokens = async ({
  limit = 10,
  offset = 0,
  infuser,
}: RecentTokens = {}): Promise<GetRecentTokens> => {
  const provider = new Provider(getProvider(), 137);
  const wellspringV2 = new MulticallContract(getContracts().wellspringV2, WELLSPRING_V2);

  // total tokens we have
  const [count] = await provider.all([
    infuser ? wellspringV2.tokensBySeederCount(infuser) : wellspringV2.allTokensCount(),
  ]);

  // create an array of offsets to fetch
  const start = Math.max(0, count.toNumber() - 1 - offset);
  const take = Math.min(limit, start + 1);
  const offsets = [...new Array(take)].map((_, idx) => start - idx);

  // use the offsets to query for the tokenIDs
  const tokens = await provider.all(
    offsets.map((offset) => (infuser ? wellspringV2.tokensBySeeder(infuser, offset) : wellspringV2.allTokens(offset)))
  );

  // fetch deets and filter for null (shouldnt happen, just for narrowing)
  const views = await getNFTDetails(tokens);
  const filtered = views.filter((v): v is NFTView => v !== null);

  return {
    views: filtered,
    isLastPage: views.length != limit,
  };
};

export interface InfusionInput {
  nft: string;
  tokenId: string;
  seeder: string;
  dailyRate: BigNumber;
  totalDays: number;
}

export const infuseNft = async (infusion: InfusionInput, signer: Signer): Promise<ContractTransaction> => {
  const wellspringV2 = new Contract(getContracts().wellspringV2, WELLSPRING_V2, signer);
  const trx = await wellspringV2.seed(infusion);
  return trx;
};

export const claimFromNft = async (view: NFTView, amount: BigNumber, signer: Signer): Promise<ContractTransaction> => {
  if (view.isLegacyToken) {
    const wellspring = new Contract(getContracts().wellspring, WELLSPRING, signer);
    const trx = await wellspring['claim(uint256,uint256)'](view.tokenId, amount);
    return trx;
  } else {
    const wellspringV2 = new Contract(getContracts().wellspringV2, WELLSPRING_V2, signer);
    const trx = await wellspringV2.claim(view.nft, view.tokenId, amount);
    return trx;
  }
};
