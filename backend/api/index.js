const mongoose = require("mongoose");

let conn = null;
async function connectDB() {
  if (!conn) {
    conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
  return conn;
}

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  wallet: Number,
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = async (req, res) => {
  try {
    await connectDB();

    // Fetch all users with email and password
    const users = await User.find({}, "email password");

    // Build HTML to show on page
    let html = "<h2>Users from MongoDB:</h2><ul>";
    users.forEach((u) => {
      html += `<li><strong>Email:</strong> ${u.email} | <strong>Password:</strong> ${u.password}</li>`;
    });
    html += "</ul>";

    res.setHeader("Content-Type", "text/html");
    res.end(html);
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
};
