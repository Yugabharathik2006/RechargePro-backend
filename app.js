const express = require("express");
require("dotenv").config();
const cors = require("cors");
const connectDB = require("./src/config/db");
const app = express();
const port = 3000;
const productRoutes = require("./src/routes/productRoutes");
const userRoutes = require("./src/routes/userRoutes");
const transactionRoutes = require("./src/routes/transactionRoutes");

connectDB();
app.use(cors()); // Allow all origins for now, or specify { origin: 'http://localhost:5173' }
app.use(express.json());

app.use("/products", productRoutes);
app.use("/auth", userRoutes);
app.use("/transactions", transactionRoutes);

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

module.exports = app;