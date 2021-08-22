import React, { FunctionComponent } from 'react';
import { PageSection } from './PageSection';
import { Content } from './Content';
import { Title } from './Title';
import { useTokens } from '../hooks/tokens';
import { TokenGrid } from './TokenGrid';
import { Divider } from './Divder';

export const Browse: FunctionComponent = () => {
  const { tokens } = useTokens();

  return (
    <>
      <PageSection>
        <Content>
          <Title>All VIBES NFTs</Title>
        </Content>
      </PageSection>
      <PageSection>
        <TokenGrid views={tokens} detailed />
      </PageSection>

      <PageSection>
        <Divider />
      </PageSection>
    </>
  );
};
