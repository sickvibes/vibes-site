import { BigNumber, ContractTransaction } from 'ethers';
import { isAddress, parseUnits } from 'ethers/lib/utils';
import React, { FunctionComponent, useState } from 'react';
import { ReactNode } from 'react';
import { useProtocol } from '../hooks/protocol';
import { useWallet } from '../hooks/wallet';
import { grant } from '../web3/infusion-pool';
import { Address } from './Address';
import { Button } from './Button';
import { ButtonGroup } from './ButtonGroup';
import { Connect } from './Connect';
import { Content } from './Content';
import { CuratorGate } from './Curate';
import { DecimalNumber } from './DecimalNumber';
import { Input } from './Input';
import { PageSection } from './PageSection';
import { Title } from './Title';
import { Vibes } from './Vibes';

export const GrantAllowance: FunctionComponent = () => {
  return (
    <>
      <PageSection>
        <Content>
          <Connect>
            <CuratorGate>
              <GrantContent />
            </CuratorGate>
          </Connect>
        </Content>
      </PageSection>
    </>
  );
};

export const GrantContent: FunctionComponent = () => {
  const { accountView, library, registerTransactions } = useWallet();
  const { protocolView } = useProtocol();
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('10000');
  const [trx, setTrx] = useState<ContractTransaction>(null);

  const allowance = protocolView.infusionPool.allowances.find((a) => a.address === accountView.address);
  const allowanceAmount = allowance?.amount ?? BigNumber.from(0);
  const { constraints } = protocolView.infusionPool;

  const isValidAddress = isAddress(address.toLowerCase());
  const grantAmount = parseUnits(amount || '0');

  const submitGrantTrx = async () => {
    const trx = await grant(address, grantAmount, library.getSigner());
    registerTransactions(trx);
    setTrx(trx);
  };

  let error: ReactNode = '';
  if (grantAmount.lt(constraints.minGrant)) {
    error = (
      <>
        Transfer amount must be at least <DecimalNumber number={constraints.minGrant} decimals={0} />
      </>
    );
  } else if (grantAmount.gt(allowanceAmount)) {
    error = (
      <>
        Transfer amount exceeds your <DecimalNumber number={allowanceAmount} decimals={0} /> <strong>influence</strong>
      </>
    );
  } else if (!isValidAddress) {
    error = <>Invalid recipient address</>;
  }

  if (trx) {
    return (
      <>
        <Title>Transaction Submitted</Title>
        <p>The transfer has been submitted.</p>
        <ButtonGroup>
          <Button navTo="/wallet">⚡️ VIEW TRX in WALLET</Button>
          <Button navTo="/curate">✅ DONE</Button>
        </ButtonGroup>
      </>
    );
  }

  return (
    <>
      <Title>Transfer Influence</Title>
      <Content>
        <p>
          Transfer all or part of your <strong>influence</strong> to another address to onboard another curator.
        </p>
        <p>
          <strong>your influence</strong>: <DecimalNumber number={allowanceAmount} decimals={0} />
        </p>
        <p>
          <strong>Recipient Address</strong>:
          <Input
            placeholder="Address"
            value={address}
            onTextChange={(t) => setAddress(t)}
            regex={/^[0-9a-fx]*$/i}
            spellCheck={false}
          />
        </p>
        <p>
          <strong>Allowance to Transfer</strong>:
          <Input placeholder="Allowance" value={amount} onTextChange={(t) => setAmount(t)} regex={/^[0-9]{0,10}$/} />
        </p>
        {error && <p>⚠️ {error}</p>}
        {!error && (
          <p>
            You are about to transfer <DecimalNumber number={grantAmount} decimals={0} /> of your{' '}
            <strong>influence</strong> to{' '}
            <strong>
              <Address address={address} />
            </strong>
            . This will allow them to curate NFTs into the <Vibes /> art collection or further onboard more curators.
          </p>
        )}
        <ButtonGroup>
          <Button disabled={Boolean(error)} onClick={submitGrantTrx}>
            🌱 TRANSFER INFLUENCE
          </Button>
          <Button navTo="/curate">🙅‍♀️ CANCEL</Button>
        </ButtonGroup>
      </Content>
    </>
  );
};
