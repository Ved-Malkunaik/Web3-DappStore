import { ethers } from 'ethers';

export const DAPP_STORE_ABI = [
  "function listDApp(string name, string description, string demoLink, string ipfsHash, uint256 price) public",
  "function purchaseDApp(uint256 id) public payable",
  "function downloadDApp(uint256 id) public view returns (string)",
  "function getAllDApps() public view returns (tuple(uint256 id, address owner, string name, string description, string demoLink, string ipfsHash, uint256 price, uint256 downloads)[])",
  "function hasPurchased(uint256 id, address user) public view returns (bool)",
  "function platformFeePercent() public view returns (uint256)",
  "event DAppListed(uint256 indexed id, address indexed owner, string name, uint256 price)",
  "event DAppPurchased(uint256 indexed id, address indexed buyer, uint256 price)"
];

export const DAPP_NFT_ABI = [
  "function mintLicense(address buyer, uint256 dappId) public",
  "function symbol() public view returns (string)",
  "function name() public view returns (string)"
];

export const getContract = (address, abi, signerOrProvider) => {
  return new ethers.Contract(address, abi, signerOrProvider);
};
