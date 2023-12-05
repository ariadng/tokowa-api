import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const checkSession = async (token: string) => {

	// Check if token exists
	const session = await prisma.session.findUnique({
		where: { token },
	});

	// Error: Token is invalid
	if (!session) {
		return {
			error: true,
			errorCode: 'token',
			message: 'Token is invalid',
		};
	}

	// Check if token is expired
	if (session.expiredAt < new Date()) {
		return {
			error: true,
			errorCode: 'expired',
			message: 'Token expired',
		};
	}

	// Return user data
	return {
		message: 'Token valid',
		user: await prisma.user.findUnique({
			where: {
				id: session.userId,
			}
		}),
	};

};

export { checkSession };