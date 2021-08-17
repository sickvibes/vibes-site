import { BigNumber, Contract, ContractTransaction, Signer } from 'ethers';
import { getContracts } from '../contracts';
import INFUSION_POOL from './abi/infusion-pool.json';

export const infuseNft = async (
  nft: string,
  tokenId: string,
  dailyRate: BigNumber,
  totalDays: number,
  signer: Signer
): Promise<ContractTransaction> => {
  const pool = new Contract(getContracts().infusionPool, INFUSION_POOL, signer);
  const trx = await pool.seed(nft, tokenId, dailyRate, totalDays);
  return trx;
};
