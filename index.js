const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
  ],
  credentials: true
}));
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.01a84k1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const spotCollection = client.db('spotDB').collection('spot');
    const myListCollection = client.db('spotDB').collection('List');

    app.get('/spot', async (req, res) => {
      const cursor = spotCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/spot/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await spotCollection.findOne(query)
      res.send(result);
    })

    app.post('/spot', async (req, res) => {
      const newSpot = req.body;
      console.log(newSpot);
      const result = await spotCollection.insertOne(newSpot);
      res.send(result);
    })
    
    // app.get('/myLists', async (req, res) => {
    //   console.log(req.query.email);
    //   console.log('cok cok', req.user);
    //   if (req.user && req.query && req.user.email && req.query.email && req.user.email !== req.query.email) {
    //     return res.status(403).send({message: 'forbidden access'})
    //   }
    //   else {
    //     // f
    //   }
    //   let query = {};
    //   if (req.query?.email) {
    //     query= {email: req.query.email}
    //   }
    //   console.log(req.user.email);
    //   console.log(req.query.email);
    //   const result = await myListCollection.find(query).toArray();
    //   res.send(result);
    // })

    app.get('/myLists', async (req, res) => {
      const cursor = myListCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.post('/myLists', async (req, res) => {
      const list = req.body;
      const result = await myListCollection.insertOne(list);
      res.send(result);
    })

    app.delete('/myLists/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await myListCollection.deleteOne(query);
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('Tourism Management Server is running')
})



app.listen(port, () => {
  console.log(`Server is running on PORT: ${port}`);
})