import memoize from 'lodash/memoize';
import PQueue from 'p-queue';

// help a lil bit with ipfs throttling
const queue = new PQueue({ concurrency: 2 });

export const fetchIpfsJson = memoize(
  async <T>(hash: string): Promise<T> => {
    const resp = await queue.add(() => fetch(`https://ipfs.io/ipfs/${hash}`));
    const json = await resp.json();
    return json;
  }
);

export const ipfsGatewayUrl = (ipfsUrl: string): string => {
  const match = ipfsUrl.match(/\/ipfs\/(.*)$/);
  if (!match) throw new Error();
  const [, hash] = match;
  return `https://ipfs.io/ipfs/${hash}`;
};
