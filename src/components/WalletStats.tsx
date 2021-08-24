import React, { FunctionComponent } from 'react';
import { useWallet } from '../hooks/wallet';
import { getContracts } from '..//contracts';
import { Button } from './Button';
import { ButtonGroup } from './ButtonGroup';
import { Title } from './Title';
import { Vibes } from './Vibes';
import { DecimalNumber } from './DecimalNumber';
import { Stats } from './Stats';
import { MarketPrice } from './MarketPrice';
import { TwoPanel } from './TwoPanel';
import { useTokens } from '../hooks/tokens';
import { BigNumber } from '@ethersproject/bignumber';
import { useProtocol } from '../hooks/protocol';

export const WalletStats: FunctionComponent = () => {
  const { accountView, trackInMetamask, transactions } = useWallet();
  const { protocolView } = useProtocol();
  const { tokens } = useTokens();

  const owned = tokens?.filter((t) => t.owner === accountView.address) ?? [];
  const claimable = owned.reduce((acc, t) => acc.add(t.claimable), BigNumber.from(0));
  const mining = owned.reduce((acc, t) => acc.add(t.dailyRate), BigNumber.from(0));

  const allowance = protocolView.infusionPool.allowances.find((a) => a.address === accountView.address);
  const allowanceAmount = allowance?.amount ?? BigNumber.from(0);

  return (
    <div>
      <Title>Your Wallet</Title>
      <TwoPanel>
        <div>
          <Stats>
            <p>
              🏦 <strong>balance</strong>: <DecimalNumber number={accountView.vibesBalance} decimals={0} /> <Vibes />
              <br />
              🤑 <strong>claimable</strong>: <DecimalNumber number={claimable} decimals={0} /> <Vibes />
              <br />
              💎 <strong>mining</strong>: <DecimalNumber number={mining} decimals={0} /> <Vibes />
              <br />
              🏛 <strong>vote power</strong>: <DecimalNumber number={accountView.votePower} decimals={0} />
              <br />
              🌱 <strong>influence</strong>: <DecimalNumber number={allowanceAmount} decimals={0} />
              <br />
              💰 <strong>your liquidity</strong>:{' '}
              <DecimalNumber number={accountView.vibesMaticLpBalance} decimals={0} /> LP
              <br />
              {accountView.vibesMaticLpBalance.gt(0) && (
                <>
                  <strong>&nbsp;&nbsp;&nbsp;- VIBES</strong>:{' '}
                  <DecimalNumber number={accountView.lpUnderlyingVibes} decimals={0} />
                  <br />
                  <strong>&nbsp;&nbsp;&nbsp;- MATIC</strong>:{' '}
                  <DecimalNumber number={accountView.lpUnderlyingMatic} decimals={0} /> ($
                  <MarketPrice amount={accountView.lpUnderlyingMatic} price="maticUsdcPrice" />)
                  <br />
                </>
              )}
              🖼 <strong>owned VIBES NFTs</strong>: {owned.length}
              <br />
              ⚡️ <strong>pending trx</strong>:{' '}
              {transactions.length === 0
                ? '(none)'
                : transactions.map((trx) => (
                    <Button externalNavTo={`https://polygonscan.com/tx/${trx.hash}`}>{trx.nonce}</Button>
                  ))}
            </p>
          </Stats>
        </div>
        <div>
          <ButtonGroup>
            <Button navTo={`/profile/${accountView.address}`}>⭐️ VIEW your profile</Button>
            <Button onClick={() => trackInMetamask()}>
              🦊 TRACK <Vibes /> in MetaMask
            </Button>
            <Button externalNavTo={`https://quickswap.exchange/#/add/${getContracts().vibes}/ETH`}>
              🏊‍♀️ POOL liquidity
            </Button>
            <Button
              externalNavTo={`https://quickswap.exchange/#/swap?inputCurrency=ETH&outputCurrency=${
                getContracts().vibes
              }`}
            >
              📈 BUY <Vibes />
            </Button>
            <Button
              externalNavTo={`https://quickswap.exchange/#/swap?outputCurrency=ETH&inputCurrency=${
                getContracts().vibes
              }`}
            >
              🤑 SELL <Vibes />
            </Button>
          </ButtonGroup>
        </div>
      </TwoPanel>
    </div>
  );
};
