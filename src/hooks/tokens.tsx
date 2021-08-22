import React, { createContext, FunctionComponent, useCallback, useContext, useEffect, useState } from 'react';
import { getContracts } from '../contracts';
import { Metadata } from '../lib/nft';
import { getRecentTokens, NFTView, nftViewId } from '../web3/wellspringv2';
import { batchGetAuctionInfo, TokenSale } from '../web3/ssw';
import { getAllTokens } from '../lib/vibes-api';

/**
 * Global info about the protocol
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useTokensImplementation = () => {
  const [tokens, setTokens] = useState<NFTView[] | null>(null);
  const [metadata, setMetadata] = useState<Record<string, Metadata>>({});
  const [saleInfo, setSaleInfo] = useState<Record<string, TokenSale>>({});
  const [status, setStatus] = useState<string | 'ready'>('loading');

  const fetchTokens = async () => {
    setStatus('fetching tokens');
    const tokens = await getRecentTokens({ limit: 500 });
    const sswTokens = tokens.filter((t) => t.nft === getContracts().ssw);
    setTokens(tokens);

    setStatus('fetching sale information');
    const info = await batchGetAuctionInfo(sswTokens.map((t) => t.tokenId));
    const saleInfo: Record<string, TokenSale> = {};
    for (const sale of info) {
      saleInfo[nftViewId(sale)] = sale;
    }
    setSaleInfo(saleInfo);

    setStatus('fetching cached metadata');
    const resp = await getAllTokens();
    const metadata: Record<string, Metadata> = {};
    resp.forEach((t) => (metadata[nftViewId(t)] = t.metadata));
    setMetadata(metadata);

    setStatus('ready');
  };

  useEffect(() => {
    fetchTokens();
    const h = setInterval(fetchTokens, 1000 * 60);
    return () => clearInterval(h);
  }, []);

  const getMetadata = useCallback(
    (token: NFTView): Metadata | undefined => {
      const data = metadata[nftViewId(token)];
      return data;
    },
    [metadata]
  );

  const getSaleInfo = useCallback(
    (token: NFTView): TokenSale | undefined => {
      const data = saleInfo[nftViewId(token)];
      return data;
    },
    [saleInfo]
  );

  return {
    status,
    tokens,
    getMetadata,
    getSaleInfo,
  };
};

type UseTokens = ReturnType<typeof useTokensImplementation>;

const TokensContext = createContext<UseTokens>(undefined);

export const TokensProvider: FunctionComponent = (props) => {
  const info = useTokensImplementation();
  return <TokensContext.Provider value={info}>{props.children}</TokensContext.Provider>;
};

export const useTokens = (): UseTokens => {
  const info = useContext(TokensContext);
  return info;
};
