import React from 'react';

import { sepolia } from '@starknet-react/chains';
import {
  StarknetConfig,
  argent,
  braavos,
  useInjectedConnectors,
  voyager,
} from '@starknet-react/core';
import { RpcProvider } from 'starknet';

export const StarknetProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { connectors } = useInjectedConnectors({
    recommended: [argent(), braavos()],
    includeRecommended: 'onlyIfNoConnectors',
    order: 'random',
  });

  return (
    <StarknetConfig
      chains={[sepolia]}
      provider={() =>
        new RpcProvider({
          nodeUrl:
            'https://starknet-sepolia.g.alchemy.com/v2/iKWI_wZKIJBEOfASy2pbaLbMAQJQat7S',
        })
      }
      connectors={connectors}
      explorer={voyager}
      autoConnect
    >
      {children}
    </StarknetConfig>
  );
};
