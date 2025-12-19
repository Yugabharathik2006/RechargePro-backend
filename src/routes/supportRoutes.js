const express = require("express");
const router = express.Router();
const supportController = require("../controllers/supportController");
const { verifyToken } = require("../middleware/authmiddleware");

// Public route - anyone can create a ticket
router.post("/", supportController.createTicket);

// Get ticket by ticket ID (public)
router.get("/ticket/:ticketId", supportController.getTicketById);

// Protected routes - require authentication
router.get("/my-tickets", verifyToken, supportController.getUserTickets);

// Admin routes (you can add admin middleware later)
router.get("/all", verifyToken, supportController.getAllTickets);
router.patch("/:ticketId/status", verifyToken, supportController.updateTicketStatus);

module.exports = router;
