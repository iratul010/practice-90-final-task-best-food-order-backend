const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = 5000;
const jwt = require('jsonwebtoken');
app.use(cors());
app.use(express.json());
// TOKEN
function tokenCreate(user) {
  //3 parameeters pass in jwt.sign({1},'2',{3})
  const token = jwt.sign({ email: user.email }, "secret", { expiresIn: "7d" });
  return token;
}
function verifyToken(req,res,next){
   const token = req.headers.authorization.split(' ')[1]
   const verify = jwt.verify(token,'secret');
   if(!verify){
    return res.send('Your are not authorized')
   }
   req.user= verify.email
   console.log(verify)
 next();
}
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
    const foodsCollection = productDB.collection("foodsCollection");
    //USER----------------
    const userDB = client.db("userDB");
    const userCollection = userDB.collection("userCollection");

    // Products routes
    //post method for used insertOne method here
    app.post("/foods", async (req, res) => {
      const foodsData = req.body;
      
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
         
        res.send(foodData);
      } catch (err) {
        console.error("Invalid ID format:", err.message);
        res.status(400).send({ error: "Invalid ID format" });
      }
    });

    //update data
    app.patch("/foods/:id",verifyToken, async (req, res) => {
      const id = req.params.id;
      const updateData = req.body;
      const result = await foodsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );
      res.send(result);
    });

    // USER----------------
    app.post("/user", async (req, res) => {
      const user = req.body;
      const token = tokenCreate(user);
   
      const isUserExist = await userCollection.findOne({ email: user?.email });
      console.log(isUserExist);
      if (!isUserExist?._id) {
         await userCollection.insertOne(user);
        return res.send({token});
      } else {
        return res.send({
          status: "success",
          message: "Login success",
          token,
        });
      }
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
