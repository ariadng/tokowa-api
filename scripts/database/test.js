const dotenv = require("dotenv");
const mongoose = require('mongoose');

dotenv.config();

mongoose.connect(process.env.DB_CONNECTION_STRING)
	.then(() => {
		console.log("\n✅ Database is running!\n");
		mongoose.connection.close();
		process.exit(0);
	})
	.catch((err) => {
		console.error("\n❌ Couldn't connect to database.\n", err);
		process.exit();
	});
