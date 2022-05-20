import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import session from "express-session";
import bcrypt from "bcrypt";
const saltRounds = 10;

const port = 3000;
const app = express();

const client = new MongoClient("mongodb://127.0.0.1:27017");
await client.connect();
const db = client.db("banken");

const users = db.collection("user");
const accounts = db.collection("accounts");

app.use(express.static("public"));

app.use(express.json());

app.use(
	session({
		resave: false, // don't save session if unmodified
		saveUninitialized: false, // don't create session until something stored
		secret: "shhhh, very secret",
		cookie: {
			maxAge: 5 * 60 * 1000, // 5 minutes
		},
	})
);


app.get("/api/loggedin", async (req, res) => {
	if (req.session.user) {
		res.json({
			user: req.session.user,
		});
	} else {
		res.status(401).json({ error: "Unauthorized" });
	}
});
app.get("/api/user", async (req, res) => {
	if (req.session.user) {
		const person = await users.findOne({ _id: ObjectId(req.session.user) });

		res.json({
			user: person,
		});
	}
});

app.get("/api/accounts", async (req, res) => {
	if (req.session.user) {
		const account = await accounts
			.find({ User: req.session.user })
			.toArray();

		res.json({
			accounts: account,
		});
	}
});

app.post("/api/create-account", async (req, res) => {
	const parsed = parseInt(req.body.accountAmount);
	await accounts.insertOne({
		AccountName: req.body.accountName,
		AccountAmount: parsed,
		User: req.body.user,
	});
});

app.post("/api/create.html", async (req, res) => {
	const hash = await bcrypt.hash(req.body.Password, saltRounds);

	await users.insertOne({
		Username: req.body.Username,
		Email: req.body.Email,
		Password: hash,
	});

	res.json({
		success: true,
		user: req.body._id,
	});
});

app.post("/api/login", async (req, res) => {
	const user = await users.findOne({ Email: req.body.Email });

	const passMatches = await bcrypt.compare(req.body.Password, user.Password);

	if (user && passMatches) {
		req.session.user = user._id;

		res.json({});
	} else {
		res.status(401).json({ error: "Unauthorized" });
	}
});

app.post("/api/logout", (req, res) => {
	req.session.destroy(() => {
		res.json({
			loggedin: false,
		});
	});
});

app.delete("/api/delete/:id", async (req, res) => {
	await accounts.deleteOne({ _id: ObjectId(req.params.id) });
});

app.put("/api/addmoney/:id", async (req, res) => {
	await accounts.updateOne(
		{ _id: ObjectId(req.params.id) },
		{ $set: { AccountAmount: req.body.accountAmount } }
	);
});

app.put("/api/withdraw/:id", async (req, res) => {
	await accounts.updateOne(
		{ _id: ObjectId(req.params.id) },
		{ $set: { AccountAmount: req.body.accountAmount } }
	);
});


app.listen(port, () => console.log("Listening to " + port));
