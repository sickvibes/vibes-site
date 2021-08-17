import React, { FunctionComponent } from 'react';
import { useProtocol } from '../hooks/protocol';
import { Address } from './Address';
import { Content } from './Content';
import { DecimalNumber } from './DecimalNumber';
import { PageSection } from './PageSection';
import { Title } from './Title';
import { Vibes } from './Vibes';

export const Curators: FunctionComponent = () => {
  const { protocolView } = useProtocol();

  return (
    <>
      <PageSection>
        <Content>
          <Title>Curators</Title>
          <table>
            <thead>
              <tr>
                <th>curator</th>
                <th>allowance</th>
              </tr>
            </thead>
            <tbody>
              {protocolView?.infusionPool.allowances.map((a) => (
                <tr key={a.address}>
                  <td>
                    <Address address={a.address} />
                  </td>
                  <td>
                    <DecimalNumber number={a.amount} decimals={0} /> <Vibes />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Content>
      </PageSection>
    </>
  );
};
