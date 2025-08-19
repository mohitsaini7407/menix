const mongoose = require('mongoose');

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

const User = mongoose.models.User || mongoose.model('User', userSchema);

// Vercel serverless function style handler
module.exports = async (req, res) => {
	try {
		await connectDB();

		if (req.method === 'GET') {
			const users = await User.find({}, 'email password');
			return res.status(200).json({ success: true, users });
		}

		if (req.method === 'POST') {
			const { username, email, identifier, password } = req.body || {};
			const finalEmail = email || identifier;
			if (!finalEmail || !password) {
				return res.status(400).json({ success: false, error: 'email/identifier and password are required' });
			}
			const user = new User({ username: username || (finalEmail.includes('@') ? finalEmail.split('@')[0] : String(finalEmail)), email: finalEmail, password, wallet: 0 });
			await user.save();
			return res.status(201).json({ success: true, userId: user._id });
		}

		return res.status(405).json({ success: false, error: 'Method Not Allowed' });
	} catch (err) {
		return res.status(500).json({ success: false, error: err.message });
	}
};
