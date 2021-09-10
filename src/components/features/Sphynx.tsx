import React, { FunctionComponent } from 'react';
import { getContracts } from '../../contracts';
import { useTokens } from '../../hooks/tokens';
import { Content } from '../Content';
import { Divider } from '../Divder';
import { PageSection } from '../PageSection';
import { Title } from '../Title';
import { TokenGrid } from '../TokenGrid';

const DEM_CATS = [
  '5025',
  '5026',
  '5027',
  '5028',
  '5029',
  '5031',
  '5032',
  '5033',
  '5034',
  '5035',
  '5036',
  '5037',
  '5038',
  '5040',
  '5041',
  '5042',
  '5043',
  '5044',
  '5045',
  '5046',
  '5047',
  '5048',
  '5049',
  '5051',
  '5052',
];

// SPHYNX DROP LFGGGGGG
export const Sphynx: FunctionComponent = () => {
  const { tokens } = useTokens();

  const cats = tokens
    .filter((t) => t.nft === getContracts().ssw && DEM_CATS.includes(t.tokenId))
    .sort((a, b) => Number(a.tokenId) - Number(b.tokenId));

  return (
    <>
      <PageSection>
        <Content>
          <Title>SPHYNX</Title>
          <p style={{ textAlign: 'center' }}>26&mdash;50</p>
          <p style={{ textAlign: 'center' }}>Collect-A-Cat Series by JazDaArtist</p>
          <p style={{ textAlign: 'center' }}>
            “We are NOT siamese if you please. But you can collect us all if you do please."
          </p>
        </Content>
      </PageSection>
      <PageSection>
        <TokenGrid views={cats} detailed />
      </PageSection>
      <PageSection>
        <Divider />
      </PageSection>
    </>
  );
};
