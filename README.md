# Naturopura - Agricultural Technology Platform

## Overview
Naturopura is an innovative agricultural technology platform designed to empower farmers through digital solutions. The platform integrates blockchain technology, AI-powered crop health detection, and digital financial services.

## Features

### For Farmers
- **Digital Identity (eKYC)**
  - Secure digital onboarding
  - Document verification
  - Profile management

- **Financial Services**
  - Crypto payments integration (MetaMask)
  - Loan applications
  - Digital payments
  - Transaction history

- **Crop Management**
  - AI-powered crop health detection
  - Disease identification
  - Treatment recommendations
  - Plant species identification

### For Administrators
- **User Management**
  - Farmer verification
  - KYC approval
  - Account management

- **Marketplace Management**
  - Product listings
  - Order management
  - Pricing controls

## Tech Stack

### Frontend
- React + TypeScript
- Vite
- TailwindCSS
- Framer Motion
- MetaMask integration
- Ethers.js
- React Router DOM

### Backend
- Node.js + Express
- MongoDB
- TypeScript
- JWT Authentication
- Hardhat (Blockchain)
- Multer (File uploads)
- OpenZeppelin Contracts

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- MetaMask wallet
- Sepolia testnet ETH

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/naturopura.git
cd naturopura
```

2. Install dependencies for both client and server
```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

3. Set up environment variables

Client (.env):
```plaintext
VITE_API_URL=http://localhost:5000
VITE_STRIPE_PUBLIC_KEY=your_stripe_key
```

Server (.env):
```plaintext
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PLANT_NET_API_KEY=your_plantnet_key
SEPOLIA_RPC_URL=your_sepolia_url
PRIVATE_KEY=your_wallet_private_key
```

4. Run the development servers

Client:
```bash
cd client
npm run dev
```

Server:
```bash
cd server
npm run dev
```

## Smart Contract Deployment

1. Compile the contract
```bash
cd server
npx hardhat compile
```

2. Deploy to Sepolia
```bash
npx hardhat run scripts/deploy.ts --network sepolia
```

## Testing

```bash
# Run frontend tests
cd client
npm test

# Run backend tests
cd server
npm test
```

## Project Structure

```
naturopura/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── config/
│   └── public/
└── server/
    ├── src/
    │   ├── controllers/
    │   ├── models/
    │   ├── routes/
    │   └── config/
    └── contracts/
```

## Contributing
Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.



## Acknowledgments
- Plant.net API for plant identification
- OpenZeppelin for smart contract security
- MetaMask for wallet integration

