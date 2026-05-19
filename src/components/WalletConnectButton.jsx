import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const WalletConnectButton = () => {
  return (
    <ConnectButton 
      accountStatus="address"
      chainStatus="name"
      showBalance={false}
    />
  );
};

export default WalletConnectButton;
