import React, { FunctionComponent } from 'react';
import { PageSection } from './PageSection';
import { Content } from './Content';
import { Title } from './Title';
import { ButtonGroup } from './ButtonGroup';
import { Button } from './Button';
import { nftViewId, Token } from '../web3/wellspringv2';
import { getContracts } from '../contracts';
import sample from 'lodash/sample';
import { useRef } from 'react';
import { TwoPanel } from './TwoPanel';
import { Vibes } from './Vibes';
import { TokenCard } from './TokenCard';
import { useTokens } from '../hooks/tokens';
import { Address } from './Address';

export const Error404: FunctionComponent = () => {
  const { tokens } = useTokens();
  const { ssw } = getContracts();
  const choices: Token[] = [
    { nft: ssw, tokenId: '3751' },
    { nft: ssw, tokenId: '3752' },
    { nft: ssw, tokenId: '3753' },
  ];

  const { current: pick } = useRef(sample(choices));

  const found = tokens?.find((t) => nftViewId(t) === nftViewId(pick));

  return (
    <>
      <PageSection>
        <TwoPanel alignItems="center">
          <div>
            {found && (
              <>
                <Content>
                  <div>
                    <TokenCard view={found} detailed />
                  </div>
                  <p>
                    <strong>collector: </strong>

                    <Button navTo={`/profile/${found.owner}/owned`}>
                      <Address address={found.owner} />
                    </Button>
                  </p>
                </Content>
              </>
            )}
          </div>
          <div>
            <Content>
              <Title>⚠️ Page Not Found</Title>
              <p style={{ textAlign: 'center' }}>
                There is no page here, only <Vibes />.
              </p>
              <ButtonGroup>
                <Button onClick={() => window.history.back()}>⏪ BACK</Button>
                <Button navTo="/">🏠 HOME</Button>
              </ButtonGroup>
            </Content>
          </div>
        </TwoPanel>
      </PageSection>
    </>
  );
};
