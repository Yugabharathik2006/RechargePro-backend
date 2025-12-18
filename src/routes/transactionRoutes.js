const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const { verifyToken } = require("../middleware/authmiddleware");

router.post("/", verifyToken, transactionController.createTransaction);
router.get("/", verifyToken, transactionController.getUserTransactions);

module.exports = router;