const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.142y4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const serviceCollection = client.db('fruitsValley').collection('services');


        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);

        });

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.findOne(query);
            res.send(result);
        });

        app.put('/services/:id', async (req, res) => {
            const id = req.params.id;
            const updatedItem = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    itemName: updatedItem.itemName,
                    img: updatedItem.img,
                    description: updatedItem.description,
                    price: updatedItem.price,
                    quantity: updatedItem.quantity,
                    supplier: updatedItem.supplier
                }
            };
            const result = await serviceCollection.updateOne(filter, updatedDoc, options);
            res.send(result);

        });

        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.deleteOne(query);
            res.send(result);
        });

        app.post('/services', async (req, res) => {
            const newItem = req.body;
            const result = await serviceCollection.insertOne(newItem);
            res.send(result)
        });
    }
    finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Food Valley Wirehouse Server');
});

app.listen(port, () => {
    console.log('Listening to port', port);
})

