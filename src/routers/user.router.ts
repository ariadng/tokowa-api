import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get current user -> should be moved to auth router
router.get('/current', async (req: Request, res: Response) => {
	const { user } = req.body;
	
	const currentUser = await prisma.user.findFirst({
		where: { id: Number(user.id) },
	});
	
	return res.json({
		user: {
			name: currentUser?.name,
			username: currentUser?.username,
		},
	})
});

export {
	router as UserRouter,
}