const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = 5000;
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://iratul010:ly4TqWqrkDjQ1Ocm@cluster0.lijvlat.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const productDB = client.db("productDB");
    const foodsCollection = productDB.collection("foodsCollection"); // Fixed method name

    // Products routes
    //post method for used insertOne method here
    app.post("/foods", async (req, res) => {
      const foodsData = req.body;
      console.log(foodsData);
      const result = await foodsCollection.insertOne(foodsData);
      res.send(result);
    });

    //
    app.get("/foods", async (req, res) => {
      const foodsData = foodsCollection.find();
      const result = await foodsData.toArray();
      res.send(result);
    });

    // findOne method use here and get one id details
    app.get("/foods/:id", async (req, res) => {
      const id = req.params.id;

      try {
        const foodData = await foodsCollection.findOne({
          _id: new ObjectId(id),
        });
        console.log(foodData);
        res.send(foodData);
      } catch (err) {
        console.error("Invalid ID format:", err.message);
        res.status(400).send({ error: "Invalid ID format" });
      }
    });

    //update data
    app.patch("/foods/:id", async (req, res) => {
      const id = req.params.id;
      const updateData = req.body;
      const result = await foodsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );
      res.send(result);
    });

   
    //Delete data
    app.delete("/foods/:id", async (req, res) => {
      const id = req.params.id;

      const result = await foodsCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    app.listen(port, () => {
      console.log("App is listening on ", port);
    });
  } catch (err) {
    console.error(err);
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server start...");
});

//iratul010
//ly4TqWqrkDjQ1Ocm
