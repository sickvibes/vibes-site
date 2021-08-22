import { providers } from 'ethers';
import { StaticJsonRpcProvider } from '@ethersproject/providers';

export const getProvider = (): StaticJsonRpcProvider => {
  return new providers.StaticJsonRpcProvider(
    'https://polygon-mainnet.g.alchemy.com/v2/jr_W_XO155rJiT34TSnq9iwA0fe5N231',
    137
  );
};

export const getEthProvider = (): StaticJsonRpcProvider => {
  return new providers.StaticJsonRpcProvider('https://mainnet.infura.io/v3/6a5ddbf0cff0460eb7931664d7495ef9', 1);
};
