import { BigNumber, Contract, ContractTransaction, Signer } from 'ethers';
import { getContracts } from '../contracts';
import { getProvider } from '../lib/rpc';
import VIBES from './abi/vibes.json';

export const getAllowance = async (address: string, operator: string): Promise<BigNumber> => {
  const token = new Contract(getContracts().vibes, VIBES, getProvider());
  const allowance = await token.allowance(address, operator);
  return allowance;
};

export const approveInfinite = async (operator: string, signer: Signer): Promise<ContractTransaction> => {
  const token = new Contract(getContracts().vibes, VIBES, signer);
  const trx = await token.approve(operator, '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
  return trx;
};
