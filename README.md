# Naturopura - Agricultural Technology Platform

## Overview
Naturopura is an innovative agricultural technology platform designed to empower farmers through digital solutions. The platform integrates blockchain technology, AI-powered crop health detection, digital financial services, and real-time market price analysis.

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

- **Marketplace Features**
  - **NEW: Market Price Analysis**
    - Real-time price suggestions
    - Competitive market data integration
    - One-click price setting
    - Multi-source price comparison
  - Product listings management
  - Order tracking
  - Sales analytics

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
  - Market price monitoring

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
- **NEW: SERP API** (Market price analysis)

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- MetaMask wallet
- Sepolia testnet ETH
- SERP API key

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
SERP_API_KEY=your_serp_api_key
```

## API Documentation

### Price Prediction Endpoints
```
GET /api/products/predict-price
```
Query Parameters:
- `q`: Product name/description (required)
- `category`: Product category (optional)

Response:
```json
{
  "success": true,
  "predictions": [
    {
      "title": "Product Name",
      "price": "₹XXX.XX",
      "source": "Vendor Name"
    }
  ]
}
```

## Project Structure

```
naturopura/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── marketplace/
│   │   │   │   └── AddProductDialog.tsx
│   │   ├── context/
│   │   ├── pages/
│   │   └── config/
└── server/
    ├── src/
    │   ├── controllers/
    │   │   └── productController.ts
    │   ├── models/
    │   ├── routes/
    │   └── config/
```

[Rest of the existing content remains the same...]

## Acknowledgments
- Plant.net API for plant identification
- OpenZeppelin for smart contract security
- MetaMask for wallet integration
- SERP API for market price analysis
