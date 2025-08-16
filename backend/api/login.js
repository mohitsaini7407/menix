const connectDB = require("../utils/db");
const User = require("../models/User");

module.exports = async (req, res) => {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "https://menix.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  await connectDB();

  let body = req.body;
  if (!body) {
    body = await new Promise((resolve, reject) => {
      let data = "";
      req.on("data", (chunk) => { data += chunk; });
      req.on("end", () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    });
  }

  const { identifier, password } = body;

  let user;
  if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(identifier)) {
    user = await User.findOne({ email: identifier, password });
  } else {
    user = await User.findOne({ username: identifier, password });
  }

  if (user) {
    res.status(200).json({ success: true, user });
  } else {
    res.status(401).json({ success: false, error: "Invalid email/username or password" });
  }
};

