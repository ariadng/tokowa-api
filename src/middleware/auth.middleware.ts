import { Request, Response, NextFunction } from 'express';
import { checkSession } from '../utils/auth/checkSession';

const AuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	
	// Verify authentication token
	const authToken = req.header('Authorization')?.split(' ')[1];

	if (!authToken) {
		return res.json({
			error: true,
			errorCode: 'token',
			message: 'Token does not exist in Authorization header',
		});
	}

	const session = await checkSession(authToken);

	if (session.error) {
		return res.json(session);
	}

	req.body.user = session.user;
	next();
};

export { AuthMiddleware };