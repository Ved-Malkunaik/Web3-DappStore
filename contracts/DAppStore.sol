// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./DAppNFT.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DAppStore is Ownable {
    DAppNFT public nftContract;
    uint256 public platformFeePercent = 2; // 2%
    uint256 public totalDapps;
    
    struct DApp {
        uint256 id;
        address payable owner;
        string name;
        string description;
        string demoLink;
        string ipfsHash;
        uint256 price;
        uint256 downloadCount;
        bool isActive;
    }

    mapping(uint256 => DApp) public dapps;
    mapping(uint256 => mapping(address => bool)) public hasPurchased;

    event DAppListed(uint256 indexed id, address indexed owner, string name, uint256 price);
    event DAppPurchased(uint256 indexed id, address indexed buyer, uint256 price);
    event DAppUnpublished(uint256 indexed id);

    constructor(address _nftAddress) Ownable(msg.sender) {
        nftContract = DAppNFT(_nftAddress);
    }

    function listDApp(
        string memory _name, 
        string memory _description, 
        string memory _demoLink, 
        string memory _ipfsHash, 
        uint256 _price
    ) public {
        totalDapps++;
        dapps[totalDapps] = DApp({
            id: totalDapps,
            owner: payable(msg.sender),
            name: _name,
            description: _description,
            demoLink: _demoLink,
            ipfsHash: _ipfsHash,
            price: _price,
            downloadCount: 0,
            isActive: true
        });
        emit DAppListed(totalDapps, msg.sender, _name, _price);
    }

    function purchaseDApp(uint256 _id) public payable {
        DApp storage dapp = dapps[_id];
        require(dapp.isActive, "DApp is not active");
        require(msg.value >= dapp.price, "Insufficient payment");
        require(!hasPurchased[_id][msg.sender], "Already purchased");

        uint256 platformFee = (msg.value * platformFeePercent) / 100;
        uint256 developerPayment = msg.value - platformFee;

        dapp.owner.transfer(developerPayment);
        // Platform owner gets the fee
        payable(owner()).transfer(platformFee);

        hasPurchased[_id][msg.sender] = true;
        dapp.downloadCount++;
        
        // Mint NFT license
        nftContract.mint(msg.sender, dapp.ipfsHash);

        emit DAppPurchased(_id, msg.sender, msg.value);
    }

    function unpublishDApp(uint256 id) public {
        DApp storage dapp = dapps[id];
        require(msg.sender == dapp.owner || msg.sender == owner(), "Not authorized");
        dapp.isActive = false;
        emit DAppUnpublished(id);
    }

    function getAllDApps() public view returns (DApp[] memory) {
        uint256 activeCount = 0;
        for (uint256 i = 1; i <= totalDapps; i++) {
            if (dapps[i].isActive) {
                activeCount++;
            }
        }

        DApp[] memory activeDApps = new DApp[](activeCount);
        uint256 currentIndex = 0;
        for (uint256 i = 1; i <= totalDapps; i++) {
            if (dapps[i].isActive) {
                activeDApps[currentIndex] = dapps[i];
                currentIndex++;
            }
        }
        return activeDApps;
    }

    function getipfsHashForBuyer(uint256 _id) public view returns (string memory) {
        require(hasPurchased[_id][msg.sender] || dapps[_id].owner == msg.sender, "Access denied");
        return dapps[_id].ipfsHash;
    }
}
