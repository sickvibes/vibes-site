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
    const buffer: NFTView[] = [];

    let offset = 0;
    let count = 0;
    const limit = 250;

    while (true) {
      setStatus(`😎 querying contract cluster (${++count})...`);
      const { views, isLastPage } = await getRecentTokens({ limit, offset });
      buffer.push(...views);

      if (isLastPage) {
        break;
      }

      offset += views.length;
    }

    setTokens(buffer);

    setStatus('🏄‍♂️ resolving screensaver data...');
    const sswTokens = buffer.filter((t) => t.nft === getContracts().ssw || t.nft === getContracts().sswv0);
    const info = await batchGetAuctionInfo(sswTokens);
    const saleInfo: Record<string, TokenSale> = {};
    for (const sale of info) {
      saleInfo[nftViewId(sale)] = sale;
    }
    setSaleInfo(saleInfo);

    setStatus('⛹️‍♀️ fetching metadata blob...');
    const resp = await getAllTokens();
    const metadata: Record<string, Metadata> = {};
    resp.forEach((t) => (metadata[nftViewId(t)] = t.metadata));
    setMetadata(metadata);

    setStatus('ready');
  };

  useEffect(() => {
    fetchTokens();
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
