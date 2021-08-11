import { NFTView, nftViewId } from '../web3/wellspringv2';
import { fetchIpfsJson } from './ipfs';
import memoize from 'lodash/memoize';
import sample from 'lodash/sample';

export interface Metadata {
  name: string;
  description: string;
  image?: string;
  animation_url?: string;
  external_url?: string;
  attributes: Array<{ trait_type: string; value: string }>;

  creator?: string;
  media?: {
    mimeType: string;
    size?: number;
  };
}

export class NftBag {
  private remaining: Record<string, NFTView> = {};

  constructor(public readonly tokens: NFTView[]) {
    for (const token of tokens) {
      this.remaining[nftViewId(token)] = token;
    }
  }

  exists(token: NFTView): boolean {
    return this.remaining[nftViewId(token)] != undefined;
  }

  take(token: NFTView): void {
    delete this.remaining[nftViewId(token)];
  }

  takeAny(): NFTView | undefined {
    return this.takeWhere(() => true);
  }

  takeWhere(predicate: (token: NFTView) => boolean): NFTView | undefined {
    const found = Object.values(this.remaining).filter(predicate);
    const sampled = sample(found);
    if (sampled !== undefined) {
      delete this.remaining[nftViewId(sampled)];
    }
    return sampled;
  }
}

export const resolveMetadata = memoize(async (view: NFTView): Promise<Metadata> => {
  const uri = view.tokenUri;

  // base64 encoded
  if (uri.match(/^data:application\/json;/)) {
    return parseBase64MetadataUri(uri);
  }

  // ipfs-style
  const match = uri.match(/ipfs\/(.*)$/);
  if (!match) {
    throw new Error('cannot resolve metadata');
  }

  const fetched = await fetchIpfsJson<Metadata>(match[1]);

  return fetched;
}, nftViewId);

const parseBase64MetadataUri = (uri: string): Metadata => {
  const [, encoded] = uri.match(/^data:application\/json;base64,(.*)$/) ?? [];
  const payload = JSON.parse(atob(encoded));
  return { ...payload, attributes: payload.attribues ?? [] };
};
