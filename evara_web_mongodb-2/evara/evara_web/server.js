/* ============================================================
   Evara - small Express backend for user accounts.
   Serves the static site AND persists registered users to
   MongoDB (via Mongoose) with scrypt-hashed passwords.
   Run:  npm install && npm start   ->  http://localhost:3000
   Requires a MONGODB_URI in a .env file (see .env.example).
   ============================================================ */

require("dotenv").config();
const express = require("express");
const path = require("path");
const crypto = require("crypto");
const mongoose = require("mongoose");
const User = require("./models/User");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/evara";

app.use(express.json());
app.use(express.static(__dirname)); // serve index.html, script.js, css, etc.

/* ---------------- database connection ---------------- */
mongoose.connect(MONGODB_URI)
    .then(() => console.log("MongoDB connected:", MONGODB_URI))
    .catch((err) => {
        console.error("MongoDB connection error:", err.message);
        process.exit(1);
    });

/* ---------------- password hashing (scrypt) ---------------- */
function hashPassword(password, salt) {
    salt = salt || crypto.randomBytes(16).toString("hex");
    const hash = crypto.scryptSync(password, salt, 64).toString("hex");
    return { salt, hash };
}
function verifyPassword(password, salt, hash) {
    const candidate = crypto.scryptSync(password, salt, 64).toString("hex");
    if (candidate.length !== hash.length) return false;
    return crypto.timingSafeEqual(Buffer.from(candidate), Buffer.from(hash));
}

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const publicUser = (u) => ({ username: u.username, email: u.email });

/* ---------------- routes ---------------- */
app.post("/api/register", async (req, res) => {
    try {
        const { username, email, password, confirm } = req.body || {};
        if (!username || !email || !password) return res.json({ ok: false, msg: "Please fill all fields." });
        if (!emailRe.test(email)) return res.json({ ok: false, msg: "Enter a valid email address." });
        if (String(password).length < 4) return res.json({ ok: false, msg: "Password must be at least 4 characters." });
        if (confirm !== undefined && password !== confirm) return res.json({ ok: false, msg: "Passwords do not match." });

        const em = String(email).toLowerCase();
        const existing = await User.findOne({ email: em });
        if (existing) return res.json({ ok: false, msg: "An account with this email already exists." });

        const { salt, hash } = hashPassword(password);
        const user = await User.create({ username, email: em, salt, hash });
        res.json({ ok: true, msg: "Account created! You are now logged in.", user: publicUser(user) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, msg: "Server error. Please try again." });
    }
});

app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body || {};
        if (!email || !password) return res.json({ ok: false, msg: "Please enter email and password." });
        const user = await User.findOne({ email: String(email).toLowerCase() });
        if (!user || !verifyPassword(password, user.salt, user.hash))
            return res.json({ ok: false, msg: "Invalid email or password." });
        res.json({ ok: true, msg: "Logged in successfully.", user: publicUser(user) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, msg: "Server error. Please try again." });
    }
});

app.post("/api/profile", async (req, res) => {
    try {
        const { email, username } = req.body || {};
        if (!username) return res.json({ ok: false, msg: "Username cannot be empty." });
        const user = await User.findOne({ email: String(email).toLowerCase() });
        if (!user) return res.json({ ok: false, msg: "User not found." });
        user.username = username;
        await user.save();
        res.json({ ok: true, msg: "Profile updated.", user: publicUser(user) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, msg: "Server error. Please try again." });
    }
});

/* Forgot password: issue a short-lived reset token. A real site emails a
   reset link; with no mail service here we return the token so the demo
   flow can continue (the front-end shows it on screen). */
app.post("/api/forgot", async (req, res) => {
    try {
        const { email } = req.body || {};
        if (!email || !emailRe.test(email)) return res.json({ ok: false, msg: "Enter a valid email address." });
        const user = await User.findOne({ email: String(email).toLowerCase() });
        // Always respond the same way so we don't reveal which emails exist...
        if (!user) return res.json({ ok: true, msg: "If an account exists for that email, a reset code has been sent." });

        const token = crypto.randomBytes(4).toString("hex").toUpperCase(); // 8-char code
        user.resetToken = token;
        user.resetExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
        await user.save();
        // ...but for the demo we also hand back the code (normally emailed).
        res.json({ ok: true, msg: "Reset code generated.", devToken: token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, msg: "Server error. Please try again." });
    }
});

/* Reset password using the code from /api/forgot. */
app.post("/api/reset", async (req, res) => {
    try {
        const { email, token, password, confirm } = req.body || {};
        if (!email || !token) return res.json({ ok: false, msg: "Enter your email and reset code." });
        if (!password || String(password).length < 4) return res.json({ ok: false, msg: "New password must be at least 4 characters." });
        if (confirm !== undefined && password !== confirm) return res.json({ ok: false, msg: "Passwords do not match." });

        const user = await User.findOne({ email: String(email).toLowerCase() });
        if (!user || !user.resetToken || user.resetToken !== String(token).trim().toUpperCase())
            return res.json({ ok: false, msg: "Invalid reset code." });
        if (!user.resetExpires || Date.now() > user.resetExpires)
            return res.json({ ok: false, msg: "This reset code has expired. Please request a new one." });

        const { salt, hash } = hashPassword(password);
        user.salt = salt; user.hash = hash;
        user.resetToken = null; user.resetExpires = null;
        await user.save();
        res.json({ ok: true, msg: "Password reset! You can now sign in." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, msg: "Server error. Please try again." });
    }
});

app.post("/api/password", async (req, res) => {
    try {
        const { email, current, next } = req.body || {};
        const user = await User.findOne({ email: String(email).toLowerCase() });
        if (!user) return res.json({ ok: false, msg: "User not found." });
        if (!verifyPassword(current || "", user.salt, user.hash))
            return res.json({ ok: false, msg: "Current password is incorrect." });
        if (!next || String(next).length < 4) return res.json({ ok: false, msg: "New password must be at least 4 characters." });
        const { salt, hash } = hashPassword(next);
        user.salt = salt; user.hash = hash;
        await user.save();
        res.json({ ok: true, msg: "Password updated." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, msg: "Server error. Please try again." });
    }
});

app.listen(PORT, () => console.log(`Evara server running at http://localhost:${PORT}`));
