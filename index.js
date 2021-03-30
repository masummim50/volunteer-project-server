const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.msj15.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const ObjectId = require('mongodb').ObjectID;

app.use(express.json());
app.use(cors());
app.use(bodyParser.json())

app.use(express.urlencoded({extended: false}))

client.connect(err => {
  const collection = client.db("volunteerDatabase").collection("volunteerProjects");
  // all requests goes inside this block of code



  app.get('/events', (req, res) => {
    collection.find({})
    .toArray((error, documents)=> {
      res.send(documents)
    })
  })
  app.post('/addevents', (req, res)=> {
    const eventData = req.body;
    console.log(eventData)
    collection.insertOne(eventData)
    .then(result => console.log(result.insertedCount))
  })

  app.get('/singleevent/:id', (req, res)=> {
    collection.find({_id: ObjectId(req.params.id)})
    .toArray((error, documents)=> {
      res.send(documents[0])
    })
  })

  app.delete('/deleteevent/:id', (req, res)=> {
    collection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => console.log(result))
  })



});





app.get('/', (req, res)=> {
  res.send('hello')
})

app.listen(process.env.PORT || 5000)