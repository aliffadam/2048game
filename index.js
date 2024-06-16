const express = require('express')
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const uitl = require('./util');

const app = express()
const port = process.env.PORT || 3000;

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://b022110114:Wanasofea01@zawanah.yaxiom4.mongodb.net/?retryWrites=true&w=majority&appName=Zawanah"

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
   } finally {
      // Ensures that the client will close when you finish/error
      //  await client.close();
   }
}
run().catch(console.dir);

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.get('/', (req, res) => {
   res.sendFile('register.html', { root: __dirname })
})

app.post('/register', async (req, res) => {
   client.db("2048_game").collection("users").find({
      "username": { $eq: req.body.username }
   }).toArray().then((result) => {
      if (result.length > 0) {
         res.status(400).send('Username already exists')
      } else {
         client.db("2048_game").collection("users").insertOne({
            "username": req.body.username,
            "password": req.body.password
         })
         res.send('Register successfully')
      }
   })
})

app.listen(port, () => {
   console.log(`Example app listening on port ${port}`)
})