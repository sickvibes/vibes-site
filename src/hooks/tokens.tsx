import React, { createContext, FunctionComponent, useCallback, useContext, useEffect, useState } from 'react';
import { getContracts } from '../contracts';
import { Metadata, resolveMetadata } from '../lib/nft';
import { getRecentTokens, NFTView, nftViewId } from '../web3/wellspringv2';
import { batchGetAuctionInfo, TokenSale } from '../web3/ssw';

/**
 * Global info about the protocol
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useTokensImplementation = () => {
  const [tokens, setTokens] = useState<NFTView[] | null>(null);
  const [metadata, setMetadata] = useState<Record<string, Metadata>>({});
  const [saleInfo, setSaleInfo] = useState<Record<string, TokenSale>>({});
  const [status, setStatus] = useState<'loading' | 'ready'>('loading');

  const fetchTokens = async () => {
    const tokens = await getRecentTokens({ limit: 200 });
    const sswTokens = tokens.filter((t) => t.nft === getContracts().ssw);
    setTokens(tokens);
    const info = await batchGetAuctionInfo(sswTokens.map((t) => t.tokenId));
    const saleInfo: Record<string, TokenSale> = {};
    for (const sale of info) {
      saleInfo[nftViewId(sale)] = sale;
    }
    setSaleInfo(saleInfo);
    setStatus('ready');
  };

  useEffect(() => {
    fetchTokens();
    const h = setInterval(fetchTokens, 1000 * 60);
    return () => clearInterval(h);
  }, []);

  const fetchMetadata = async (token: NFTView) => {
    const resolved = await resolveMetadata(token);
    setMetadata((prev) => {
      const key = nftViewId(token);
      if (prev[key]) return prev; // optimization -- dont set state if we've already got metadata
      return {
        ...prev,
        [key]: resolved,
      };
    });
  };

  const getMetadata = useCallback(
    (token: NFTView): Metadata | undefined => {
      const data = metadata[nftViewId(token)];
      if (data === undefined) fetchMetadata(token);
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
