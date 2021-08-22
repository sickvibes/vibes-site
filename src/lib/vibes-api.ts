import { Metadata } from './nft';

export interface APIToken {
  index: number;
  nft: string;
  tokenId: string;
  tokenUri: string;
  creator: string;
  metadata: Metadata;
}

export const getAllTokens = async (): Promise<APIToken[]> => {
  const req = await fetch('https://e1p7wcrjl5.execute-api.us-east-1.amazonaws.com/tokens');
  const json = await req.json();
  return json.tokens;
};
