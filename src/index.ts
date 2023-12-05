import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';

import { AuthRouter } from './routers/auth.router';
import { RegisterRouter } from './routers/register.router';
import { UserRouter } from './routers/user.router';
import { AuthMiddleware } from './middleware/auth.middleware';

// Enable environment variables
dotenv.config();

// Create express app
const app	= express();
const port 	= process.env.SERVER_PORT || 4000;

// Enable CORS
app.use(cors());

// Configure body-parser middleware
app.use(bodyParser.json());

app.get('/', (req: Request, res: Response) => {
	res.send('Hello World!');
});

// Configure routes
app.use('/auth', 		AuthRouter);
app.use('/register',	RegisterRouter);
app.use('/user', 		AuthMiddleware, UserRouter);

// Start server
app.listen(port, () => {
	console.clear();
	console.log(`Server listening on port ${port}`);
	console.log(`\n`);
});