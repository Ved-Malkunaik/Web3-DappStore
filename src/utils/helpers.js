import { ethers } from 'ethers';

export const shortenAddress = (address) => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

export const formatEther = (wei) => {
  if (!wei) return '0';
  return ethers.formatEther(wei);
};

export const parseEther = (eth) => {
  if (!eth) return '0';
  return ethers.parseEther(eth.toString());
};

export const formatDate = (timestamp) => {
  return new Date(Number(timestamp) * 1000).toLocaleDateString();
};
