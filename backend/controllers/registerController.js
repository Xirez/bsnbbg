const usersDB = {
	users: require("../model/users.json"),
	setUsers: function (data) {
		this.users = data;
	},
};
const fsPromises = require("fs").promises;
const path = require("path");

const User = require('../model/User')
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
	const { user, pwd } = req.body;
	if (!user || !pwd) return res.status(400).json({ message: "Username and password are required." });
	// check for duplicate usernames in the db
	const duplicate = usersDB.users.find((person) => person.username === user);
	if (duplicate) return res.sendStatus(409); //Conflict
	try {
		//encrypt the password
		const salt = await bcrypt.genSalt(10);
		const hashedPwd = await bcrypt.hash(pwd, salt);
		//store the new user
		const newUser = {
			username: user,
			roles: { User: 2001 },
			password: hashedPwd,
		};
		usersDB.setUsers([...usersDB.users, newUser]);
		await fsPromises.writeFile(path.join(__dirname, "..", "model", "users.json"), JSON.stringify(usersDB.users));
		console.log(usersDB.users);


		//const user = await User.create({ username, email, password: hashedPwd });
		console.log(user)
		res.status(201).json({ success: `New user ${user} created!` });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

module.exports = { handleNewUser };
