const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const util = require('./util');

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
   res.sendFile('register.html', { root: __dirname });
});

app.post('/register', async (req, res) => {
   try {
      const { username, password } = req.body;

      const existingUser = await client.db("2048_game").collection("users").findOne({ username });

      if (existingUser) {
         return res.status(400).json({ message: 'Username already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await client.db("2048_game").collection("users").insertOne({
         username,
         password: hashedPassword
      });

      res.status(200).json({ message: 'Register successfully' });
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
   }
});

app.listen(port, () => {
   console.log(`Example app listening on port ${port}`);
});
