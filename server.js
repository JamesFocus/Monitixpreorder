/**
 * Montiix Watch Preorder Shop – Node.js server
 * Serves the shop page and accepts preorder submissions.
 */

require("dotenv").config();
const express = require("express");
const path = require("path");
const fs = require("fs");
const { randomUUID } = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "data", "preorders.json");

// Ensure data directory & file exist
if (!fs.existsSync(path.dirname(DATA_FILE))) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
}
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, "[]", "utf8");
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// ── GET preorder stats (public) ──────────────────────────────────────────
app.get("/api/stats", (req, res) => {
  try {
    const orders = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    const total = orders.length;
    const remaining = Math.max(0, 500 - total); // limited to 500 units
    res.json({ total, remaining, limit: 500 });
  } catch {
    res.json({ total: 0, remaining: 500, limit: 500 });
  }
});

// ── POST preorder ────────────────────────────────────────────────────────
app.post("/api/preorder", (req, res) => {
  try {
    const { name, email, phone, model, size, quantity, notes } = req.body || {};

    // Basic validation
    if (!name || !email || !model) {
      return res.status(400).json({
        success: false,
        error: "Name, email and model are required.",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Please enter a valid email address.",
      });
    }

    const orders = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));

    if (orders.length >= 500) {
      return res.status(410).json({
        success: false,
        error: "Preorder limit reached. Join the waitlist for the next batch.",
      });
    }

    const order = {
      id: randomUUID(),
      name: String(name).trim().slice(0, 100),
      email: String(email).trim().toLowerCase().slice(0, 120),
      phone: phone ? String(phone).trim().slice(0, 30) : null,
      model: String(model).trim(),
      size: size ? String(size).trim() : "42mm",
      quantity: Math.min(Math.max(parseInt(quantity, 10) || 1, 1), 3),
      notes: notes ? String(notes).trim().slice(0, 500) : null,
      status: "preorder",
      createdAt: new Date().toISOString(),
    };

    orders.push(order);
    fs.writeFileSync(DATA_FILE, JSON.stringify(orders, null, 2), "utf8");

    console.log(`[preorder] #${orders.length} – ${order.name} <${order.email}> – ${order.model}`);

    res.status(201).json({
      success: true,
      message: "Preorder secured. Confirmation will be sent to your email.",
      orderId: order.id,
      position: orders.length,
    });
  } catch (err) {
    console.error("[preorder] error:", err);
    res.status(500).json({ success: false, error: "Server error. Please try again." });
  }
});

// Fallback to index for SPA-like behaviour
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`\n  ⌚  Montiix Preorder Shop`);
  console.log(`  ➜  http://localhost:${PORT}\n`);
});
