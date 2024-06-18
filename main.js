const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://b022110114:Wanasofea01@zawanah.yaxiom4.mongodb.net/?retryWrites=true&w=majority&appName=Zawanahe";

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
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
   } catch (err) {
      console.error(err);
   }
}
run().catch(console.dir);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
   res.sendFile('index.html', { root: __dirname });
});

app.post('/register', async (req, res) => {
   try {
      const { username, email, password } = req.body;

      const existingUser = await client.db("2048_game").collection("users").findOne({ username });

      if (existingUser) {
         return res.status(400).json({ success: false, message: 'Username already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await client.db("2048_game").collection("users").insertOne({
         username,
         email,
         password: hashedPassword
      });

      res.status(200).json({ success: true, message: 'Register successfully' });
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

      res.status(200).json({ success: true, message: 'Login successful' });
   } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
   }
});

app.listen(port, () => {
   console.log(`Example app listening on port ${port}`);
});
