const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;
//Middleware
app.use(cors());
app.use(express.json());

// set database Config

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.btddfnu.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const serviceCollection = client.db("brilliantAuto").collection("service");
    //load all data on server url //! ------(R) for READ-- FOR CRUD
    app.get("/service", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });
    //create api upon single user request from uid

    app.get("/service/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.send(service);
    });
    //received or add  data from UI by POST  //! ----C for CREATE-- FOR CRUD

    app.post("/service", async (req, res) => {
      const serviceFromUI = req.body;
      const result = await serviceCollection.insertOne(serviceFromUI);
      res.send(result);
    });
    //DELETE API   //! ----D for DELETE-- FOR CRUD
    app.delete("/service/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await serviceCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Welcome Running brilliant server");
});
app.listen(port, () => {
  console.log("Listening to port", port);
});
