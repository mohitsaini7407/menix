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
	// CORS headers for browser requests
	const allowedOrigin = process.env.FRONTEND_URL || 'https://menix.vercel.app';
	res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
	res.setHeader('Vary', 'Origin');
	res.setHeader('Access-Control-Allow-Credentials', 'true');
	res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

	// Preflight
	if (req.method === 'OPTIONS') {
		return res.status(204).end();
	}

	const path = (req.url || '').split('?')[0] || '/';

	// Lightweight health/status endpoints without DB
	if (req.method === 'GET' && (path === '/' || path === '/api/index' || path === '/api/health')) {
		return res.status(200).json({ status: 'OK', timestamp: new Date().toISOString(), environment: process.env.NODE_ENV || 'development' });
	}

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
