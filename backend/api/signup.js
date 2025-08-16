const connectDB = require("../utils/db");
const User = require("../models/User");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "https://menix.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

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

  const { username, email, password } = body;

  const existing = await User.findOne({ $or: [{ email }, { username }] });
  if (existing) {
    return res.status(400).json({ success: false, error: "User already exists" });
  }

  const user = new User({ username, email, password, wallet: 500 });
  await user.save();

  res.status(201).json({ success: true, user });
};

