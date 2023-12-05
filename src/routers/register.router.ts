import express, { Request, Response } from 'express';
import { PrismaClient, User } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { SHA256 } from 'crypto-js';

const router = express.Router();
const prisma = new PrismaClient();

// Handle user registration
router.post('/', async (req: Request, res: Response) => {
	try {
		const { username, password, name } = req.body;
		
		// Simple validation
		
		if (!username || !password || !name) {
			return res.status(400).json({
				error: true,
				message: 'Please provide name, username, and password',
			});
		}

		if (
			username.length < 4
			|| password.length < 4
			|| name.length < 4
		) {
			return res.status(400).json({
				error: true,
				message: 'Name, username, and password must be 4 or more characters',
			});
		}

		if (
			username.length > 64
			|| password.length > 64
			|| name.length > 64
		) {
			return res.status(400).json({
				error: true,
				message: 'Name, username, and password must be 64 characters or less',
			});
		}

		// Check if user exists
		let user: User | null = await prisma.user.findUnique({
			where: {
				username,
			}
		});

		if (user !== null) {
			return res.json({
				error: true,
				errorCode: 'user',
				message: `User already exists`,
			});
		}
	
		const newUser = await prisma.user.create({
			data: {
				name,
				username,
				password: SHA256(password).toString(),
			}
		});

		// Create session
		const expiredAt = new Date();
		expiredAt.setDate(expiredAt.getDate() + 7);

		const session = await prisma.session.create({
			data: {
				token: uuidv4(),
				userId: newUser.id,
				expiredAt,
			},
		});

		// Return session token & user data
		return res.json({
			message: 'Register new user success',
			token: session.token,
			user,
		});

	} catch (error) {
		return res.json({
			error: true,
			errorCode: 'user',
			message: `Failed to register user`,
		});
	}

});

export {
	router as RegisterRouter,
}