import { BigNumber } from 'ethers';
import React, { FunctionComponent } from 'react';
import { useProtocol } from '../hooks/protocol';
import { useWallet } from '../hooks/wallet';
import { Button } from './Button';
import { ButtonGroup } from './ButtonGroup';
import { Connect } from './Connect';
import { Content } from './Content';
import { DecimalNumber } from './DecimalNumber';
import { PageSection } from './PageSection';
import { Stats } from './Stats';
import { Title } from './Title';
import { TwoPanel } from './TwoPanel';
import { Vibes } from './Vibes';

export const Curate: FunctionComponent = () => {
  return (
    <>
      <PageSection>
        <Content>
          <Connect>
            <CurateContent />
          </Connect>
        </Content>
      </PageSection>
    </>
  );
};

export const CuratorGate: FunctionComponent = (props) => {
  const { accountView } = useWallet();
  const { protocolView } = useProtocol();
  const allowance = protocolView.infusionPool.allowances.find((a) => a.address === accountView.address);
  const allowanceAmount = allowance?.amount ?? BigNumber.from(0);

  if (allowanceAmount.gt(0)) {
    return <>{props.children}</>;
  }

  return (
    <>
      <Content>
        <Title>Curate</Title>
        <p>
          ⚠️ You are not currently a curator. Curators are selected by the <Vibes /> multisig or granted allowance by
          other curators.
        </p>
        <ButtonGroup>
          <Button onClick={() => window.history.back()}>⏪ BACK</Button>
        </ButtonGroup>
      </Content>
    </>
  );
};

const CurateContent: FunctionComponent = () => {
  const { accountView } = useWallet();
  const { protocolView } = useProtocol();
  const allowance = protocolView.infusionPool.allowances.find((a) => a.address === accountView.address);
  const allowanceAmount = allowance?.amount ?? BigNumber.from(0);

  return (
    <CuratorGate>
      <Content>
        <Title>Curate</Title>
        <p>
          🔥 You are a <Vibes /> curator. This allows you to influence the <Vibes /> art collection by adding new NFTs
          to the network or granting others the ability to curate.
        </p>
        <p>
          🧪 How you integrate this into your story as an artist or collector is entirely up to you. Each curator will
          have their own individual approach and process.
        </p>
        <Stats>
          🌱 <strong>your influence</strong>: <DecimalNumber number={allowanceAmount} decimals={0} />
          <br />
          <strong>🏊‍♀️ grant pool balance</strong>:{' '}
          <DecimalNumber decimals={0} number={protocolView.infusionPool.balance} /> <Vibes />
        </Stats>
        <ButtonGroup>
          <Button navTo="/curate/curators">👀 VIEW CURATORS</Button>
        </ButtonGroup>
        <TwoPanel>
          <div>
            <Title>Infuse NFTs</Title>
            <Content>
              <p>
                Curators can infuse any NFT they own with <Vibes /> that can be mined by collectors.
              </p>
              <ButtonGroup>
                <Button navTo="/curate/infuse">🔥 INFUSE</Button>
              </ButtonGroup>
            </Content>
          </div>
          <div>
            <Title>Transfer Influence</Title>
            <Content>
              <p>
                Curators can transfer some or all of their <strong>influence</strong> to another address, onboarding new
                curators.
              </p>
              <ButtonGroup>
                <Button navTo="/curate/grant">🌱 TRANSFER</Button>
              </ButtonGroup>
            </Content>
          </div>
        </TwoPanel>
      </Content>
    </CuratorGate>
  );
};
