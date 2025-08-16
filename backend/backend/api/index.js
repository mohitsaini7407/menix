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

    // Fetch username & password from MongoDB
    const users = await User.find({}, "username password");

    // Send HTML with script that logs data to browser console
    res.setHeader("Content-Type", "text/html");
    res.end(`
      <!DOCTYPE html>
      <html>
        <head><title>MongoDB Data</title></head>
        <body>
          <h2>Open browser console (F12)</h2>
          <script>
            const users = ${JSON.stringify(users)};
            console.log("Users from MongoDB:", users);
          </script>
        </body>
      </html>
    `);
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
};
