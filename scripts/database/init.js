db.createUser(
	{
		user: "restayusr",
		pwd: "Parampam6993",
		roles: [
			{
				role: "readWrite",
				db: "restay"
			}
		]
	}
);

db.createCollection("test");