const SupportTicket = require("../models/supportModel");

// Create a new support ticket
exports.createTicket = async (req, res) => {
    try {
        const { name, email, subject, message, priority } = req.body;

        // Get user ID if authenticated
        const userId = req.user?.id || null;

        const ticket = new SupportTicket({
            name,
            email,
            subject: subject || "General Inquiry",
            message,
            priority: priority || "medium",
            user: userId,
        });

        const savedTicket = await ticket.save();

        res.status(201).json({
            success: true,
            message: "Support ticket created successfully! Our team will get back to you within 24 hours.",
            ticket: {
                ticketId: savedTicket.ticketId,
                status: savedTicket.status,
                createdAt: savedTicket.createdAt,
            },
        });
    } catch (error) {
        console.error("Create ticket error:", error);
        res.status(400).json({
            success: false,
            message: error.message || "Failed to create support ticket",
        });
    }
};

// Get all tickets for a user
exports.getUserTickets = async (req, res) => {
    try {
        const userId = req.user?.id;
        const email = req.query.email;

        let query = {};
        if (userId) {
            query = { $or: [{ user: userId }, { email: email }] };
        } else if (email) {
            query = { email: email };
        } else {
            return res.status(400).json({
                success: false,
                message: "User ID or email required",
            });
        }

        const tickets = await SupportTicket.find(query).sort({ createdAt: -1 });

        res.json({
            success: true,
            tickets,
        });
    } catch (error) {
        console.error("Get tickets error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch support tickets",
        });
    }
};

// Get single ticket by ID
exports.getTicketById = async (req, res) => {
    try {
        const { ticketId } = req.params;

        const ticket = await SupportTicket.findOne({ ticketId });

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found",
            });
        }

        res.json({
            success: true,
            ticket,
        });
    } catch (error) {
        console.error("Get ticket error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch ticket",
        });
    }
};

// Update ticket status (for admin or auto-response)
exports.updateTicketStatus = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { status, response } = req.body;

        const updateData = { status };
        if (response) {
            updateData.response = response;
            updateData.respondedAt = new Date();
        }

        const ticket = await SupportTicket.findOneAndUpdate(
            { ticketId },
            updateData,
            { new: true }
        );

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found",
            });
        }

        res.json({
            success: true,
            message: "Ticket updated successfully",
            ticket,
        });
    } catch (error) {
        console.error("Update ticket error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update ticket",
        });
    }
};

// Get all tickets (admin)
exports.getAllTickets = async (req, res) => {
    try {
        const { status, priority } = req.query;

        let query = {};
        if (status) query.status = status;
        if (priority) query.priority = priority;

        const tickets = await SupportTicket.find(query)
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: tickets.length,
            tickets,
        });
    } catch (error) {
        console.error("Get all tickets error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch tickets",
        });
    }
};
