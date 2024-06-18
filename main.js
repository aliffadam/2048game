const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://b022110114:Wanasofea01@zawanah.yaxiom4.mongodb.net/?retryWrites=true&w=majority&appName=Zawanah";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();
        console.log("Connected to MongoDB!");
    } catch (err) {
        console.error(err);
    }
}
run().catch(console.dir);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await client.db("2048_game").collection("users").findOne({ email });

        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await client.db("2048_game").collection("users").insertOne({
            username,
            email,
            password: hashedPassword
        });

        res.status(200).json({ success: true, message: 'Registration successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.post('/login', async (req, res) => {
   try {
       const { email, password } = req.body;

       const user = await client.db("2048_game").collection("users").findOne({ email });

       if (!user) {
           return res.status(400).json({ success: false, message: 'Invalid email or password' });
       }

       const isPasswordValid = await bcrypt.compare(password, user.password);

       if (!isPasswordValid) {
           return res.status(400).json({ success: false, message: 'Invalid email or password' });
       }

       const token = jwt.sign({ id: user._id, email: user.email }, 'your_jwt_secret', { expiresIn: '1h' });

       res.status(200).json({ success: true, message: 'Login successful', token });
   } catch (error) {
       console.error(error);
       res.status(500).json({ success: false, message: 'Internal Server Error' });
   }
});

// Example: Add leaderboard routes and MongoDB operations

// Endpoint to fetch leaderboard entries
app.get('/leaderboard', async (req, res) => {
    try {
        const leaderboard = await client.db("2048_game").collection("leaderboard")
            .find()
            .sort({ score: -1 }) // Sort by score descending
            .limit(10) // Limit to top 10 entries
            .toArray();

        res.status(200).json({ success: true, leaderboard });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// Endpoint to add new score to leaderboard
app.post('/leaderboard', async (req, res) => {
    try {
        const { username, score } = req.body;

        await client.db("2048_game").collection("leaderboard").insertOne({
            username,
            score,
            date: new Date()
        });

        res.status(200).json({ success: true, message: 'Score added to leaderboard' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.listen(port, () => {
   console.log(`App listening on port ${port}`);
});
