const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");
const db = require('./config/db');
const PORT = process.env.PORT || 4000;

// Custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS! And fetch cookies credentials requirement
app.use(credentials);

// Remove || !origin from whitelist after development @ config/corsOptions.js
app.use(cors(corsOptions));

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// Serve static files
app.use("/", express.static(path.join(__dirname, "/public")));

// Routes
app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));

app.use(verifyJWT);
app.use("/employees", require("./routes/api/employees"));

// Catch all - 404
app.all("*", (req, res) => {
	res.status(404);
	if (req.accepts("html")) {
		res.sendFile(path.join(__dirname, "views", "404.html"));
	} else if (req.accepts("json")) {
		res.json({ error: "404 Not Found" });
	} else {
		res.type("txt").send("404 Not Found");
	}
});

app.use(errorHandler);

// Sync models with the database
db.sync({ force: false, alter: true }).then(() => {
    console.log('Database is synced');
}).catch((error) => {
    console.error('Error syncing database:', error);
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
