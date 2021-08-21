import React, { FunctionComponent } from 'react';
import { getContracts } from '../../contracts';
import { useTokens } from '../../hooks/tokens';
import { Content } from '../Content';
import { Divider } from '../Divder';
import { PageSection } from '../PageSection';
import { Title } from '../Title';
import { TokenGrid } from '../TokenGrid';

const DEM_GRABBAZ = ['4260', '4261', '4262', '4263', '4264', '4265', '4266', '4267', '4268'];

// LFGGGGG
export const Cashgrabbaz: FunctionComponent = () => {
  const { tokens } = useTokens();

  if (tokens == null) {
    return (
      <PageSection>
        <Content>
          <Title>⌛️ LOADING TOKENS</Title>
        </Content>
      </PageSection>
    );
  }

  const grabbaz = tokens.filter((t) => t.nft === getContracts().ssw && DEM_GRABBAZ.includes(t.tokenId));

  return (
    <>
      <PageSection>
        <Content>
          <Title>CASHGRABBAZ</Title>
          <p>
            “ON MY JOURNEYS THROUGH THE VOID I STUMBLED UPON THESE DELICIOUSLY DEVIOUS CREATURES. WITH CAUTION I
            APPROACHED THEM AND OFFERED SOME FOOD, THEY IGNORED ME AND CONTINUED THEIR MISCHIEVOUS BUSINESS. UNSATISFIED
            WITH THE RESULTS OF MY INQUIRY I HAD TO PUSH HARDER, WHAT COULD THEY WANT. I OPENED MY WALLET TO SEE IF
            MAYBE SOMETHING IN THERE WOULD BE OF HELP, A MISTAKE. ALL NINE OF THEM BROKE THEIR TRANCE AND POUNCED ON MY
            PERSONS. ONE OF THEM GRABBED THE WALLET AND STARTED THROWING CASH TO THE OTHERS, BY THE VOID THESE LIL
            FUCKERS JUST LOVE MONEY! $_$ AN IDEA WAS BORN, I HAD TO GET THEM BACK TO THE INFUSER! AN EXPERIMENT WAS IN
            ORDER, CURIOUS! WHAT WOULD HAPPEN IF I WAS TO INFUSE THESE LIL “CASHGRABBAZ” WITH VIBES. PERHAPS JUST MAYBE,
            IF I MIXED THEIR PIXELS WITH VIBES…WELL HONESTLY MY HOPE IS THAT THEY TRANSFORM. VOID ONLY KNOWS WHY I WOULD
            WANT THAT, CURIOSITY KILLED THE CAT I SUPPOSE.”
            <br />
            VOIDKROSS_2021
          </p>
          <p>
            EACH CASHGRABBA IS INFUSED WITH 69 DAYS OF VIBES, IF U HODL THESE BAD BOYS FOR THAT LONG DM ME AND I WILL
            SEND YOU A TRANSFORMED VERSION OF UR CASHGRABBAZ!!! EVOLVED FORM LFG
          </p>
        </Content>
      </PageSection>
      <PageSection>
        <TokenGrid views={grabbaz} detailed />
      </PageSection>
      <PageSection>
        <Divider />
      </PageSection>
    </>
  );
};
