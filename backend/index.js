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
	res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS');
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
			await connectDB();
			
			// Check if it's a specific user wallet request
			if (path.startsWith('/api/wallet/')) {
				const userId = path.split('/').pop();
				console.log('Fetching wallet for user:', userId);
				
				try {
					const user = await User.findById(userId).select('username email wallet');
					if (user) {
						return res.status(200).json({ 
							success: true, 
							user: {
								id: user._id,
								username: user.username,
								email: user.email,
								wallet: user.wallet || 0
							}
						});
					} else {
						return res.status(404).json({ success: false, error: 'User not found' });
					}
				} catch (error) {
					console.error('Error fetching user wallet:', error);
					return res.status(500).json({ success: false, error: 'Failed to fetch wallet data' });
				}
			}
			
			// Default users endpoint
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

		if (req.method === 'PUT') {
			await connectDB();
			
			// Check if it's a wallet update request
			if (path.startsWith('/api/wallet/')) {
				const userId = path.split('/').pop();
				const { amount, operation } = req.body; // operation: 'add' or 'subtract'
				
				console.log('Updating wallet for user:', userId, 'amount:', amount, 'operation:', operation);
				
				if (!amount || !operation || !['add', 'subtract'].includes(operation)) {
					return res.status(400).json({ success: false, error: 'Invalid amount or operation' });
				}
				
				try {
					const user = await User.findById(userId);
					if (!user) {
						return res.status(404).json({ success: false, error: 'User not found' });
					}
					
					// Update wallet balance
					if (operation === 'add') {
						user.wallet = (user.wallet || 0) + amount;
					} else {
						if ((user.wallet || 0) < amount) {
							return res.status(400).json({ success: false, error: 'Insufficient balance' });
						}
						user.wallet = (user.wallet || 0) - amount;
					}
					
					await user.save();
					console.log('Wallet updated for user:', userId, 'new balance:', user.wallet);
					
					return res.status(200).json({ 
						success: true, 
						user: {
							id: user._id,
							username: user.username,
							email: user.email,
							wallet: user.wallet
						}
					});
				} catch (error) {
					console.error('Error updating user wallet:', error);
					return res.status(500).json({ success: false, error: 'Failed to update wallet' });
				}
			}
			
			return res.status(405).json({ success: false, error: 'Method Not Allowed' });
		}

		return res.status(405).json({ success: false, error: 'Method Not Allowed' });
	} catch (err) {
		return res.status(500).json({ success: false, error: err.message });
	}
};
