# Tswaanda Marketplace Dashboard
Dashboard for tswaanda marketplace

Tswaanda Dashboard is a web application for managing and monitoring data related to Tswaanda services. 
The application consists of a frontend built using ReactJS and a backend built using Express, Node.js, and MongoDB. 

NB: <em>This backend will be replaced
 by a backend being developed on Dfinity ICP.</em>
 
## Getting Started

To get started with Tswaanda Dashboard, follow these instructions:

### Prerequisites

To run the frontend and backend, you'll need the following software installed on your machine:

- Node.js (version 12 or higher)
- MongoDB (version 4 or higher)

### Installing

1. Clone the repository to your local machine:

```bash 
git clone https://github.com/tswaanda/dashboard.git
```

2. Navigate to the `client` folder and install the frontend dependencies:

```bash
cd client
npm install
```
3. Navigate to the `server` folder and install the backend dependencies:

```bash
cd ../server
npm install
```

### Running the Frontend

To run the frontend, navigate to the `client` folder and run the following command:

```bash
npm run dev
```

This will start the frontend development server and open the application in your default web browser.

### Running the Backend

To run the backend, you'll need to first create a MongoDB connection and populate the database. Here are the steps:

1. Create a new file in the `server` folder called `.env`.
2. In the `.env` file, add the following environment variables:
```javascript
MONGODB_URI=<your mongodb uri>
```

Replace `<your mongodb uri>` with the URI for your MongoDB database.

3. Populate the database by removing the comments in the file `index.js` found on the root of the `server` folder.
```javascript
          /* ONLY ADD DATA ONE TIME */
         AffiliateStat.insertMany(dataAffiliateStat);
         OverallStat.insertMany(dataOverallStat);
         Product.insertMany(dataProduct);
         ProductStat.insertMany(dataProductStat);
         Transaction.insertMany(dataTransaction);
         User.insertMany(dataUser)
  ```
  
  4. Start the backend server by running the following command:
  
  ```bash
  npm start
  ```
  
  This will start the backend server and make it accessible at `http://localhost:5000`
  
  ## Contributing
  
  If you'd like to contribute to Tswaanda Dashboard, please fork the repository and submit a pull request. We'd love to see your contributions!


