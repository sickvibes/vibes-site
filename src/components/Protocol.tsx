import React, { FunctionComponent } from 'react';
import { PageSection } from './PageSection';
import { Content } from './Content';
import { Title } from './Title';
import { Vibes } from './Vibes';
import { Address } from './Address';
import { useProtocol } from '../hooks/protocol';
import { DecimalNumber } from './DecimalNumber';
import { Stats } from './Stats';
import { Button } from './Button';
import { MarketPrice } from './MarketPrice';
import { TwoPanel } from './TwoPanel';
import { Divider } from './Divder';
import { ButtonGroup } from './ButtonGroup';
import { useTokens } from '../hooks/tokens';
import { BigNumber } from '@ethersproject/bignumber';

export const Protocol: FunctionComponent = () => {
  const { protocolView } = useProtocol();
  const { tokens } = useTokens();

  if (protocolView == null) {
    return (
      <PageSection>
        <Content>
          <Title>⌛️ LOADING PROTOCOL INFO</Title>
        </Content>
      </PageSection>
    );
  }

  const legacyTokens = tokens.filter((t) => t.isLegacyToken);
  const v2Tokens = tokens.filter((t) => !t.isLegacyToken);

  const totalDailyRate = v2Tokens.reduce((acc, t) => acc.add(t.dailyRate), BigNumber.from(0));
  const totalClaimable = v2Tokens.reduce((acc, t) => acc.add(t.claimable), BigNumber.from(0));
  const totalClaimed = v2Tokens.reduce((acc, t) => acc.add(t.claimed), BigNumber.from(0));

  const legacyDailyRate = legacyTokens.reduce((acc, t) => acc.add(t.dailyRate), BigNumber.from(0));
  const legacyClaimable = legacyTokens.reduce((acc, t) => acc.add(t.claimable), BigNumber.from(0));
  const legacyClaimed = legacyTokens.reduce((acc, t) => acc.add(t.claimed), BigNumber.from(0));

  return (
    <>
      <PageSection>
        <Content>
          <Title>VIBES Protocol Overview</Title>
          <TwoPanel>
            <div>
              <Stats>
                <strong>🤑 circulating supply</strong>:{' '}
                <DecimalNumber
                  number={protocolView.vibesToken.totalSupply.sub(protocolView.gnosisSafe.vibesBalance)}
                  decimals={0}
                />{' '}
                <Vibes />
              </Stats>
            </div>
            <div>
              <Content>
                <p>
                  Total circulating supply includes all <Vibes /> "in the wild". This includes wallets, market
                  liquidity, the <Vibes /> Wellspring, and grant pool contracts.
                </p>
              </Content>
            </div>
          </TwoPanel>
          <TwoPanel>
            <div>
              <Stats>
                <strong>✨ total infused</strong>:{' '}
                <DecimalNumber
                  number={protocolView.wellspring.reserveVibesBalance.add(protocolView.wellspringV2.totalVibesLocked)}
                  decimals={0}
                />{' '}
                <Vibes />
              </Stats>
            </div>
            <div>
              <Content>
                <p>
                  The total amount of <Vibes /> infused across all NFTs. This will decrease as collectors claim the
                  infused <Vibes /> to their wallets and increase as new pieces are infused.
                </p>
              </Content>
            </div>
          </TwoPanel>
          <TwoPanel>
            <div>
              <Stats>
                <strong>😎 total claimable</strong>:{' '}
                <DecimalNumber number={totalClaimable.add(legacyClaimable)} decimals={0} /> <Vibes />
              </Stats>
            </div>
            <div>
              <Content>
                <p>
                  Infused <Vibes /> that have been mined and are claimable by collectors. This will increase as more{' '}
                  <Vibes /> are mined, and decrease as collectors claim mined tokens.
                </p>
              </Content>
            </div>
          </TwoPanel>
          <TwoPanel>
            <div>
              <Stats>
                <strong>💎 total mining</strong>:{' '}
                <DecimalNumber number={totalDailyRate.add(legacyDailyRate)} decimals={0} /> <Vibes /> / day
              </Stats>
            </div>
            <div>
              <Content>
                <p>
                  The total active mining rate across all <Vibes /> NFTs that have infused tokens. This will decrease as
                  NFTs fully mine their infused <Vibes /> and increase as new pieces are infused.
                </p>
              </Content>
            </div>
          </TwoPanel>
          <TwoPanel>
            <div>
              <Stats>
                <strong>🎁 grant pool balance</strong>:{' '}
                <DecimalNumber number={protocolView.infusionPool.balance} decimals={0} /> <Vibes />
              </Stats>
            </div>
            <div>
              <Content>
                <p>
                  The grant pool is used by curators to infuse NFTs with <Vibes /> from Provenance Mining Grants. When
                  this runs out, the community must pass a proposal to fund another grant, or infusions can only be done
                  with <Vibes /> from the curator's wallet.
                </p>
              </Content>
            </div>
          </TwoPanel>
          <TwoPanel>
            <div>
              <Stats>
                <strong>🔥 total claimed</strong>:{' '}
                <DecimalNumber number={totalClaimed.add(legacyClaimed)} decimals={0} /> <Vibes />
              </Stats>
            </div>
            <div>
              <Content>
                <p>
                  The total <Vibes /> claimed from infused NFTs. This will increase as collectors claim more <Vibes />{' '}
                  from their owned NFTs.
                </p>
              </Content>
            </div>
          </TwoPanel>

          <Title>VIBES Smart Contracts</Title>
          <p>
            The <Vibes /> protocol is made up of a cluster smart contracts. Information about the parameters, roles, and
            addresses of the main contracts are listed here.
          </p>
          <p>
            For more information, check out the{' '}
            <Button externalNavTo="https://docs.sickvibes.xyz/resources/architecture">Architecture</Button> info on the{' '}
            <Vibes /> documentation site.
          </p>
        </Content>
      </PageSection>
      <PageSection>
        <Content>
          <div>
            <Title>VIBES Token</Title>
            <TwoPanel>
              <div>
                <Content>
                  <Stats>
                    <strong>address</strong>:{' '}
                    <Button externalNavTo={`https://polygonscan.com/address/${protocolView.vibesToken.address}`}>
                      <Address address={protocolView.vibesToken.address} />
                    </Button>
                    <br />
                    <strong>supply</strong>: <DecimalNumber decimals={0} number={protocolView.vibesToken.totalSupply} />{' '}
                    <Vibes />
                  </Stats>
                  <ButtonGroup>
                    <Button externalNavTo={`https://polygonscan.com/token/${protocolView.vibesToken.address}`}>
                      🔎 VIEW transfers
                    </Button>
                  </ButtonGroup>
                </Content>
              </div>
              <div>
                <Content>
                  <p>
                    <Vibes /> is a standard ERC-20 token with a <code>MINTER</code> role that allows minting of new
                    tokens.
                  </p>
                  <p>Total supply is not yet finalized while the protocol is in early-phase development.</p>
                </Content>
              </div>
            </TwoPanel>
          </div>
          <div>
            <Title>Market (QuickSwap)</Title>
            <TwoPanel>
              <div>
                <Stats>
                  <strong>address</strong>:{' '}
                  <Button
                    externalNavTo={`https://quickswap.exchange/#/swap?inputCurrency=ETH&outputCurrency=${protocolView.quickswap.vibesMaticPool.address}`}
                  >
                    <Address address={protocolView.quickswap.vibesMaticPool.address} />
                  </Button>
                  <br />
                  <strong>VIBES price</strong>:{' '}
                  <DecimalNumber number={protocolView.quickswap.vibesUsdcPrice} decimals={5} /> USD
                  <br />
                  <strong>VIBES price</strong>:{' '}
                  <DecimalNumber number={protocolView.quickswap.vibesMaticPrice} decimals={5} /> MATIC
                  <br />
                  <strong>MATIC price</strong>:{' '}
                  <DecimalNumber number={protocolView.quickswap.maticUsdcPrice} decimals={2} /> USD
                  <br />
                  <strong>total liquidity</strong>:{' '}
                  <DecimalNumber number={protocolView.quickswap.vibesMaticPool.totalSupply} decimals={0} /> LP
                  <br />
                  <strong>&nbsp;- VIBES</strong>:{' '}
                  <DecimalNumber number={protocolView.quickswap.vibesMaticPool.vibesReserve} decimals={0} />
                  <br />
                  <strong>&nbsp;- MATIC</strong>:{' '}
                  <DecimalNumber number={protocolView.quickswap.vibesMaticPool.maticReserve} decimals={0} /> ($
                  <MarketPrice amount={protocolView.quickswap.vibesMaticPool.maticReserve} price="maticUsdcPrice" />)
                </Stats>
              </div>
              <div>
                <Content>
                  <p>
                    QuickSwap is a decentralized exchange that has VIBES-MATIC liquidity to support the buying and
                    selling of <Vibes />.
                  </p>
                  <ButtonGroup>
                    <Button
                      externalNavTo={`https://polygonscan.com/address/${protocolView.quickswap.vibesMaticPool.address}#tokentxns`}
                    >
                      🔎 VIEW market trxs
                    </Button>
                    <Button
                      externalNavTo={`https://info.quickswap.exchange/pair/${protocolView.quickswap.vibesMaticPool.address}`}
                    >
                      📊 VIEW market stats
                    </Button>
                  </ButtonGroup>
                </Content>
              </div>
            </TwoPanel>
          </div>
          <div>
            <Title>Wellspring v1</Title>
            <TwoPanel>
              <div>
                <Stats>
                  <strong>address</strong>:{' '}
                  <Button externalNavTo={`https://polygonscan.com/address/${protocolView.wellspring.address}`}>
                    <Address address={protocolView.wellspring.address} />
                  </Button>
                  <br />
                  <strong>balance</strong>:{' '}
                  <DecimalNumber decimals={0} number={protocolView.wellspring.reserveVibesBalance} /> <Vibes />
                  <br />
                  <strong>claimed</strong>: <DecimalNumber decimals={0} number={legacyClaimed} /> <Vibes />
                  <br />
                  <strong>claimable</strong>: <DecimalNumber decimals={0} number={legacyClaimable} /> <Vibes />
                  <br />
                  <strong>mining</strong>: <DecimalNumber decimals={0} number={legacyDailyRate} /> <Vibes /> / day
                  <br />
                  <strong>managed tokens</strong>: {protocolView.wellspring.tokenCount}
                </Stats>
              </div>
              <div>
                <Content>
                  <p>
                    The original <Vibes /> Wellspring contract that handles the bookkeeping associated with provenance
                    mining.
                  </p>
                  <p>
                    Read data is proxied through the Wellspring V2 contract now, but the original infused <Vibes /> are
                    still locked in this contract.
                  </p>
                </Content>
              </div>
            </TwoPanel>
          </div>
          <div>
            <Title>Wellspring v2</Title>
            <TwoPanel>
              <div>
                <Stats>
                  <strong>address</strong>:{' '}
                  <Button externalNavTo={`https://polygonscan.com/address/${protocolView.wellspringV2.address}`}>
                    <Address address={protocolView.wellspringV2.address} />
                  </Button>
                  <br />
                  <strong>balance</strong>:{' '}
                  <DecimalNumber decimals={0} number={protocolView.wellspringV2.totalVibesLocked} /> <Vibes />
                  <br />
                  <strong>claimed</strong>: <DecimalNumber decimals={0} number={totalClaimed} /> <Vibes />
                  <br />
                  <strong>claimable</strong>: <DecimalNumber decimals={0} number={totalClaimable} /> <Vibes />
                  <br />
                  <strong>mining</strong>: <DecimalNumber decimals={0} number={totalDailyRate} /> <Vibes /> / day
                  <br />
                  <strong>managed tokens</strong>:{' '}
                  {protocolView.wellspringV2.tokenCount - protocolView.wellspring.tokenCount}
                </Stats>
              </div>
              <div>
                <Content>
                  <p>
                    Wellspring V2 improves on V1 by adding support for multiple NFT contracts, better on-chain
                    enumerability, and multi-artist support.
                  </p>
                  <p>Locked tokens cannot be removed except by NFT owners via provenance mining</p>
                </Content>
              </div>
            </TwoPanel>
          </div>

          <div>
            <Title>Infusion Pool</Title>
            <TwoPanel>
              <div>
                <Stats>
                  <strong>address</strong>:{' '}
                  <Button externalNavTo={`https://polygonscan.com/address/${protocolView.infusionPool.address}`}>
                    <Address address={protocolView.infusionPool.address} />
                  </Button>
                  <br />
                  <strong>balance</strong>: <DecimalNumber decimals={0} number={protocolView.infusionPool.balance} />{' '}
                  <Vibes />
                  <br />
                  <strong>min rate</strong>:{' '}
                  <DecimalNumber decimals={0} number={protocolView.infusionPool.constraints.minDailyRate} /> <Vibes /> /
                  day
                  <br />
                  <strong>max rate</strong>:{' '}
                  <DecimalNumber decimals={0} number={protocolView.infusionPool.constraints.maxDailyRate} /> <Vibes /> /
                  day
                  <br />
                  <strong>min value</strong>:{' '}
                  <DecimalNumber decimals={0} number={protocolView.infusionPool.constraints.minValue} /> <Vibes />
                  <br />
                  <strong>max value</strong>:{' '}
                  <DecimalNumber decimals={0} number={protocolView.infusionPool.constraints.maxValue} /> <Vibes />
                  <br />
                  <strong>required owned NFT</strong>:{' '}
                  {protocolView.infusionPool.constraints.requireOwnedNft ? 'YES' : 'NO'}
                  <br />
                  <strong>min grant</strong>:{' '}
                  <DecimalNumber decimals={0} number={protocolView.infusionPool.constraints.minGrant} /> <Vibes />
                  <br />
                  <strong>curators</strong>: {protocolView.infusionPool.allowances.length}
                  <br />
                </Stats>
              </div>
              <div>
                <Content>
                  <p>The Infusion Pool holds provenance mining grant funds and manages curator allowances.</p>
                  <p>
                    It enforces the constraints around how <Vibes /> can be infused by curators.
                  </p>
                  <ButtonGroup>
                    <Button navTo="/curate/curators">👀 VIEW CURATORS</Button>
                  </ButtonGroup>
                </Content>
              </div>
            </TwoPanel>
          </div>

          <div>
            <Title>SQNCR</Title>
            <TwoPanel>
              <div>
                <Content>
                  <p>
                    <strong>address</strong>:{' '}
                    <Button externalNavTo={`https://polygonscan.com/address/${protocolView.sqncr.address}`}>
                      <Address address={protocolView.sqncr.address} />
                    </Button>
                    <br />
                    <strong>total minted</strong>: {protocolView.sqncr.totalMinted}
                    <br />
                    <strong>max mints per address</strong>: {protocolView.sqncr.maxMints}
                    <br />
                    <strong>mint cost</strong>: <DecimalNumber decimals={0} number={protocolView.sqncr.mintCost} />{' '}
                    <Vibes />
                  </p>
                  <ButtonGroup>
                    <Button
                      externalNavTo={`https://opensea.io/collection/vibes-sqncr?search[sortAscending]=false&search[sortBy]=CREATED_DATE`}
                    >
                      ⛵️ VIEW on OpeanSea
                    </Button>
                  </ButtonGroup>
                </Content>
              </div>
              <div>
                <Content>
                  <p>SQNCR is a standard ERC-721 (NFT) contract. </p>
                  <p>
                    The <code>CONFIG</code> role allows setting the default and token-specific metadata resolvers
                    (shell) and the <code>WITHDRAW</code> role allows removing tokens from the contract that were used
                    to pay for mints.
                  </p>
                </Content>
              </div>
            </TwoPanel>
          </div>
          <div>
            <Title>Gnosis Safe</Title>
            <TwoPanel>
              <div>
                <Stats>
                  <strong>address</strong>:{' '}
                  <Button
                    externalNavTo={`https://polygon.gnosis-safe.io/app/#/safes/${protocolView.gnosisSafe.address}`}
                  >
                    <Address address={protocolView.gnosisSafe.address} />
                  </Button>
                  <br />
                  <strong>balance</strong>
                  : <DecimalNumber decimals={0} number={protocolView.gnosisSafe.vibesBalance} /> <Vibes />
                  <br />
                  <strong>LP balance</strong>:{' '}
                  <DecimalNumber decimals={0} number={protocolView.gnosisSafe.vibesMaticLpBalance} /> LP
                </Stats>
              </div>
              <div>
                <Content>
                  <p>
                    The <Vibes /> multisig uses a Gnosis Safe to store protocol assets and manage protocol parameters.
                  </p>
                  <p>All asset transfers or contract invocations take a 3-of-5 on-chain consensus.</p>
                </Content>
              </div>
            </TwoPanel>
          </div>
          <Divider />
        </Content>
      </PageSection>
    </>
  );
};
