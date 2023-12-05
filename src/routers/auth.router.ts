import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { SHA256 } from 'crypto-js';

const router = express.Router();
const prisma = new PrismaClient();

// Handle user login
router.post('/login', async (req: Request, res: Response) => {
	const { username, password } = req.body;
	
	// Simple validation
	if (!username || !password) {
		return res.status(400).json({
			error: true,
			message: 'Please provide username and password',
		});
	}

	// Check if user exists
	const user = await prisma.user.findUnique({
		where: {
			username,
		},
		include: {
			settings: true,
		}
	});
	
	// Error: User not found
	if (!user) {
		return res.json({
			error: true,
			errorCode: 'username',
			message: `User ${username} not found`,
		});
	}

	// Error: Wrong password
	if (user.password !== SHA256(password).toString()) {
		return res.json({
			error: true,
			errorCode: 'password',
			message: 'Wrong password',
		});
	}

	// Create session
	const expiredAt = new Date();
	expiredAt.setDate(expiredAt.getDate() + 7);

	const session = await prisma.session.create({
		data: {
			token: uuidv4(),
			userId: user.id,
			expiredAt,
		},
	});

	// Return session token & user data
	return res.json({
		message: 'Login successful',
		token: session.token,
		user,
	});
});

// Handle token check
router.get('/check/:token', async (req: Request, res: Response) => {
	const { token } = req.params;

	// Check if token exists
	const session = await prisma.session.findUnique({
		where: {
			token,
		}
	});

	// Error: Token not found
	if (!session) {
		return res.json({
			error: true,
			errorCode: 'token',
			message: 'Token not found',
		});
	}

	// Check if token is expired
	if (session.expiredAt < new Date()) {
		return res.json({
			error: true,
			errorCode: 'expired',
			message: 'Token expired',
		});
	}

	// Return user data
	return res.json({
		message: 'Token valid',
		user: await prisma.user.findUnique({
			where: {
				id: session.userId,
			},
			include: {
				settings: true,
			}
		}),
	});
});

// Handle user logout
router.get('/logout/:token', async (req: Request, res: Response) => {
	const { token } = req.params;

	// Check if token exists
	const session = await prisma.session.findUnique({
		where: {
			token,
		}
	});

	// Get user
	if (session) {
		const userId = session.userId;
		// Delete all sessions belonging to this user
		await prisma.session.deleteMany({
			where: {
				userId
			}
		});
	}

	return res.json({
		message: 'Logout successful',
	});
});

export {
	router as AuthRouter,
}