import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const users = [
	{
		name: 'Demo User',
		username: 'demo',
		password: 'demo',
	},
];

const main = async () => {
	for (const user of users) {
		await prisma.user.create({
			data: user,
		});
	}	
};

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});