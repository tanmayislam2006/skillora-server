const express = require("express");
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.kn8r7rw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
app.get("/", (req, res) => {
  res.send("Hello server");
});
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    const userCollection = client.db("skillora").collection("users");
    const servicesCollection = client.db("skillora").collection("services");
    const purchaseServicesCollection = client
      .db("skillora")
      .collection("purchaseServices");

    // get a single user
    app.get("/user/:uid", async (req, res) => {
      const uid = req.params.uid;
      const query = { uid: uid };
      const user = await userCollection.findOne(query);
      if (!user) {
        return res.status(404).send({ message: "User not found", user: null });
      }
      res.send(user);
    });
    // get allServices
    app.get("/allServices", async (req, res) => {
      const query = {};
      const allServices = await servicesCollection.find(query).toArray();
      res.send(allServices);
    });
    // get single id
    app.get("/service/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      if (!service) {
        return res
          .status(404)
          .send({ message: "Service not found", service: null });
      }
      res.send(service);
    });
    // get a signle purchaseService by user uid
    app.get("/purchaseService/:uid", async (req, res) => {
      const uid = req.params.uid;
      const query = { uid: uid };
      const purchaseServices = await purchaseServicesCollection
        .find(query)
        .toArray();
      res.send(purchaseServices);
    });
    // get a user added service by user uid
    app.get("/userService/:uid", async (req, res) => {
      const uid = req.params.uid;
      const query = { uid: uid };
      const userServices = await servicesCollection.find(query).toArray();
      for (const service of userServices) {
        const serviceId = service._id;
        const bookedCount = await purchaseServicesCollection.countDocuments({
          serviceId: serviceId.toString(),
        });
        service.booked = bookedCount;
      }

      res.send(userServices);
    });
    // all purchaseServices by user
    app.post("/purchaseServices", async (req, res) => {
      const purchaseService = req.body;
      const result = await purchaseServicesCollection.insertOne(
        purchaseService
      );
      res.send(result);
    });

    // register user
    app.post("/register", async (req, res) => {
      const userInformation = req.body;
      const { email } = userInformation;
      const query = { email: email };
      const existingUser = await userCollection.findOne(query);
      if (existingUser) {
        return res.status(400).send({ message: "User already exists" });
      }
      const result = await userCollection.insertOne(userInformation);
      res.send(result);
    });
    app.post("/addService", async (req, res) => {
      const service = req.body;
      const result = await servicesCollection.insertOne(service);
      res.send(result);
    });
    // ?update service
    app.put("/updateService/:id", async (req, res) => {
      const id = req.params.id;
      const service = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          ...service,
        },
      };
      const result = await servicesCollection.updateOne(filter, updateDoc);
      res.send(result);
    });
    // update user login information
    app.patch("/login", async (req, res) => {
      const { email, lastSignInTime } = req.body;
      const filter = { email: email };
      const updateDoc = {
        $set: {
          lastSignInTime,
        },
      };
      const result = await userCollection.updateOne(filter, updateDoc);
      res.send(result);
    });
    app.delete("/deleteService/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await servicesCollection.deleteOne(query);
      if (result.deletedCount === 0) {
        return res.status(404).send({ message: "Service not found" });
      }
      res.send(result);
    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
