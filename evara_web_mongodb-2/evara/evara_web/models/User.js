const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    salt: { type: String, required: true },
    hash: { type: String, required: true },
    resetToken: { type: String, default: null },
    resetExpires: { type: Number, default: null },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
