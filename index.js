const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId;


const app = express();
app.use(bodyParser.json());
app.use(cors())
require('dotenv').config()

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4ioes.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


app.get('/',(req,res)=>{
    res.send("Party Maker Working")
})



client.connect(err => {
  const orderCollection = client.db("partyMaker").collection("orderList");
  const serviceCollection = client.db("partyMaker").collection("services");
  const reviewCollection = client.db("partyMaker").collection("review");
  const adminCollection = client.db("partyMaker").collection("admin");


  app.post('/addService', (req, res) => {
    const newService = req.body;
    console.log('adding new event: ', newService)
    serviceCollection.insertOne(newService)
    .then(result => {
        console.log('inserted count', result.insertedCount);
        res.send(result.insertedCount > 0)
    })
})

app.get('/service',(req,res)=>{
    serviceCollection.find()
    .toArray((err,documents)=>{
      res.send(documents)
    })
  })

  app.get('/service/:title', (req, res) => {
    serviceCollection.find({title: req.params.title})
    .toArray( (err, documents) => {
        res.send(documents[0]);
    })
})

  app.post('/addOrder', (req, res) => {
    const newOrder = req.body;
    orderCollection.insertOne(newOrder)
        .then(result => {
            res.send(result.insertedCount > 0);
        })
  })

  app.get('/orderDetails',(req,res)=>{
    orderCollection.find()
    .toArray((err,documents)=>{
      res.send(documents)
    })
  })

  app.get('/userOrder',(req,res)=>{
    orderCollection.find({email: req.query.email})
    .toArray((err,documents)=>{
      res.send(documents)
    })
  })


  app.post('/addReview', (req, res) => {
    const newReview = req.body;
    console.log('adding new event: ', newReview)
    reviewCollection.insertOne(newReview)
    .then(result => {
        console.log('inserted count', result.insertedCount);
        res.send(result.insertedCount > 0)
    })
})

app.post('/addAdmin', (req, res) => {
  const newAdmin = req.body;
  console.log('adding new event: ', newAdmin)
  adminCollection.insertOne(newAdmin)
  .then(result => {
      console.log('inserted count', result.insertedCount);
      res.send(result.insertedCount > 0)
  })
})


app.get('/review',(req,res)=>{
  reviewCollection.find()
  .toArray((err,documents)=>{
    res.send(documents)
  })
})

app.get('/admin', (req, res) => {
  adminCollection.find({})
      .toArray((err, documents) => {
          res.send(documents);
      })
});

app.post('/isAdmin', (req, res) => {
  const email = req.body.email;
  adminCollection.find({ email: email })
      .toArray((err, admin) => {
          res.send(admin.length > 0);
      })
})
  

app.patch('/updateOrder/:id',(req,res)=>{
  orderCollection.updateOne({_id: ObjectId(req.params.id)},
  {
    $set: {status: req.body.status} 
  })
  .then(result=>{
    res.send(result.modifiedCount > 0)
  })

})


  app.delete('/deleteService/:id', (req, res) => {
    const id = req.params.id;
    serviceCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => {
        res.send(result.deletedCount > 0)
    })
  })




});





app.listen(process.env.PORT || 5000)