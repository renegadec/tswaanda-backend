# Tswaanda Marketplace Dashboard
Dashboard for tswaanda marketplace

Tswaanda Dashboard is a web application for managing and monitoring data related to Tswaanda services. 
The application is a dapp consisting of a frontend canister built using ReactJS and a backend canister built using motoko. 
 
## Getting Started

To get started with Tswaanda Dashboard, follow these instructions:

### Prerequisites

To run the frontend and backend canisters, you'll need the following software installed on your machine:

- Node.js (version 12 or higher)
- DFX (version 14)

### Installing

1. Clone the repository to your local machine:

```bash 
git clone https://github.com/renegadec/tswaanda-backend.git

```

2. Navigate to the `tswaanda` folder and install the dependencies:

```bash
cd tswaanda-backend/tswaanda
npm install
```

### Running the project

1. Start local dfx

```bash
dfx start --clean
```
2. Split your terminal and deploy the canisters and generate candid interface

```
dfx deploy
```
2. Start the frontend

```
npm start
```
You are all set, the react frontend should be running at `http://localhost:8080/` if you don't have other programs running on the same port

  
  ## Contributing
  
  If you'd like to contribute to Tswaanda Dashboard, please fork the repository and submit a pull request. We'd love to see your contributions!


