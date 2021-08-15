import React, { FunctionComponent, useEffect, useState } from 'react';
import { resolveTwitterId } from '../lib/proof-of-twitter';
import { truncateHex } from '../lib/strings';
import { lookupEnsName } from '../lib/ens';
import { Button } from './Button';
import { whalesSpottedInTheWild } from '../whales';

interface Props {
  address: string;
}

const _cache = new Map<string, string>(
  // overrides
  [
    ['0xb0432D4911Bc9283a853987cBb7704e123CE7393', '@Professor-Wrecks'],
    ['0xA3e51498579Db0f7bb1ec9E3093B2F44158E25a5', '@sgt_slaughtermelon'],
  ]
);

export const Address: FunctionComponent<Props> = ({ address }) => {
  const [resolved, setResolved] = useState<string | undefined>(_cache.get(address));

  const fetch = async () => {
    if (_cache.has(address)) {
      return;
    }
    const id = await resolveTwitterId(address);
    if (id === undefined) {
      const name = await lookupEnsName(address);
      if (name) {
        setResolved(name);
        _cache.set(address, name);
      }
      return;
    }
    const name = `@${id}`;
    setResolved(name);
    _cache.set(address, name);
  };

  useEffect(() => {
    setResolved(_cache.get(address));
    fetch();
  }, [address]);

  return (
    <span>
      {whalesSpottedInTheWild.includes(address) && <>🐳</>}
      {resolved ? resolved : truncateHex(address)}
    </span>
  );
};

export const ExplorerButton: FunctionComponent<Props> = ({ address }) => {
  return (
    <Button externalNavTo={`https://polygonscan.com/address/${address}`}>
      <Address address={address} />
    </Button>
  );
};
