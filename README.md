# 🖼️ Decentralized Image Share
A decentralized application for secure image sharing powered by blockchain technology. Upload your images to IPFS and control access through smart contracts on the Ethereum network.

## ✨ Features

- 🔐 **Decentralized Storage**: Images are stored on IPFS, ensuring permanence and immutability
- 📝 **Smart Contracts**: Ethereum-based access control and ownership management
- 🔑 **Granular Access Control**: Grant or revoke image access to specific addresses
- 🎨 **Modern UI**: Intuitive React-based interface for seamless user experience

## 🛠️ Tech Stack

- **Blockchain**: Solidity, Hardhat, Ethereum
- **Frontend**: React, ethers.js, Web3.js
- **Storage**: IPFS, Pinata
- **Testing**: Chai, Mocha

## 🚀 Quick Start

### Prerequisites

- Node.js >= 14.0.0
- npm >= 6.14.0
- MetaMask browser extension

### Installation

1. Clone the repository
```bash
git clone https://github.com/Chirag30Sharma/Decentralized-Image-Sharing-Application.git
cd Decentralized-Image-Sharing-Application
```

2. Install Hardhat dependencies
```bash
npm install
```

3. Compile smart contracts
```bash
npx hardhat compile
```

4. Deploy to local network
```bash
npx hardhat run scripts/deploy.js --network localhost
```

5. Set up frontend
```bash
cd client
npm install
npm start
```

## 💡 Usage Guide

### Setting Up

1. **Configure MetaMask**
   - Install MetaMask browser extension
   - Connect to your preferred network (localhost:8545 for development)

2. **Environment Setup**
   - Create `.env` file in project root
   - Add your Pinata API keys:
     ```env
     PINATA_API_KEY=your_api_key
     PINATA_SECRET_KEY=your_secret_key
     ```

### Using the dApp

1. **Upload Images**
   - Connect your wallet
   - Select an image to upload
   - Confirm the transaction in MetaMask
   - Wait for IPFS upload confirmation

2. **Manage Access**
   - Grant access: Enter recipient's address and click "Grant Access"
   - Revoke access: Select user from access list and click "Revoke Access"
   - View shared images: Enter address and click "Get Data"

> ⚠️ **Important**: Always upload images before clicking "Get Data" to avoid access errors

## 🙏 Acknowledgments

- [IPFS](https://ipfs.io/) for decentralized storage
- [OpenZeppelin](https://openzeppelin.com/) for secure smart contract templates
- [Hardhat](https://hardhat.org/) for Ethereum development environment
- [React](https://reactjs.org/) for the frontend framework
