import React, { FunctionComponent } from 'react';
import { useTokens } from '../hooks/tokens';
import { Content } from './Content';
import { PageSection } from './PageSection';
import { Title } from './Title';

export const LoadGate: FunctionComponent = (props) => {
  const { status } = useTokens();

  if (status === 'ready') {
    return <>{props.children}</>;
  }

  return (
    <PageSection>
      <Content>
        <Title>⌛️ LOADING VIBES</Title>
      </Content>
      <p style={{ textAlign: 'center' }}>{status}</p>
    </PageSection>
  );
};
