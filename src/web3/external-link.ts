import { getContracts } from '../contracts';
import { Token } from './wellspringv2';

interface ExternalLink {
  symbol?: string;
  name: string;
  url: string;
}

export const resolveExternalLink = (token: Token): ExternalLink => {
  switch (token.nft) {
    case getContracts().ssw:
      return { symbol: 'ssw', name: 'Screensaver', url: `https://www.screensaver.world/object/${token.tokenId}` };
    case getContracts().sswv0:
      return { symbol: 'v0', name: 'Screensaver V0', url: `https://v0.screensaver.world/object/${token.tokenId}` };
  }

  return { name: 'OpenSea', url: `https://opensea.io/assets/matic/${token.nft}/${token.tokenId}` };
};
