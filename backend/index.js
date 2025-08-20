const mongoose = require('mongoose');

let conn = null;
async function connectDB() {
	if (!conn) {
		try {
			console.log('Connecting to MongoDB...');
			conn = await mongoose.connect(process.env.MONGO_URI, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
			});
			console.log('MongoDB Connected Successfully');
		} catch (error) {
			console.error('MongoDB Connection Error:', error);
			throw error;
		}
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
			console.log('Login attempt:', { finalEmail, hasPassword: !!password });
			
			if (!finalEmail || !password) {
				return res.status(400).json({ success: false, error: 'email/identifier and password are required' });
			}
			
			// First try to authenticate existing user
			console.log('Looking for existing user with email:', finalEmail);
			const existingUser = await User.findOne({ email: finalEmail });
			console.log('Existing user found:', !!existingUser);
			
			if (existingUser) {
				// User exists, check password
				console.log('Checking password for user:', existingUser.email);
				if (existingUser.password === password) {
					// Password matches, return user data
					console.log('Password match successful for user:', existingUser.email);
					return res.status(200).json({ 
						success: true, 
						user: {
							id: existingUser._id,
							username: existingUser.username || finalEmail.split('@')[0],
							email: existingUser.email,
							wallet: existingUser.wallet || 0
						}
					});
				} else {
					// Wrong password
					console.log('Password mismatch for user:', existingUser.email);
					return res.status(401).json({ success: false, error: 'Invalid password' });
				}
			}
			
			// User doesn't exist, create new user
			console.log('Creating new user with email:', finalEmail);
			const newUser = new User({ 
				username: username || (finalEmail.includes('@') ? finalEmail.split('@')[0] : String(finalEmail)), 
				email: finalEmail, 
				password, 
				wallet: 0 
			});
			await newUser.save();
			console.log('New user created:', newUser.email);
			return res.status(201).json({ 
				success: true, 
				user: {
					id: newUser._id,
					username: newUser.username,
					email: newUser.email,
					wallet: newUser.wallet
				}
			});
		}

		return res.status(405).json({ success: false, error: 'Method Not Allowed' });
	} catch (err) {
		return res.status(500).json({ success: false, error: err.message });
	}
};
