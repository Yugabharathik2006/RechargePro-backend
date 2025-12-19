const mongoose = require("mongoose");

const supportTicketSchema = new mongoose.Schema(
    {
        ticketId: {
            type: String,
            unique: true,
        },
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            lowercase: true,
        },
        subject: {
            type: String,
            default: "General Inquiry",
        },
        message: {
            type: String,
            required: [true, "Message is required"],
        },
        status: {
            type: String,
            enum: ["open", "in-progress", "resolved", "closed"],
            default: "open",
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high", "urgent"],
            default: "medium",
        },
        response: {
            type: String,
            default: null,
        },
        respondedAt: {
            type: Date,
            default: null,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Generate ticket ID before saving
supportTicketSchema.pre("save", async function (next) {
    if (!this.ticketId) {
        const count = await mongoose.model("SupportTicket").countDocuments();
        this.ticketId = `TKT${String(count + 1).padStart(6, "0")}`;
    }
    next();
});

module.exports = mongoose.model("SupportTicket", supportTicketSchema);
