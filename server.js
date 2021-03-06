const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db, collection;


const url = "mongodb+srv://NewUser:NewUser@savage-9awz2.mongodb.net/test";

// const url = "mongodb+srv://NewUser:NewUser@cluster0-q2ojb.mongodb.net/test?retryWrites=true";
// mongo "mongodb+srv://savage-9awz2.mongodb.net/test"  --username NewUser
const dbName = "Books";

app.listen(3000, () => {
    MongoClient.connect(url, { useNewUrlParser: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
});

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  //console.log(db)
  db.collection('messages').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {messages: result})
  })
})

app.post('/messages', (req, res) => {
  db.collection('messages').save({BookTitle: req.body.BookTitle, BookOwner: req.body.BookOwner, BorrowerName: req.body.BorrowerName, Date:req.body.Date}, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

// app.put('/messages', (req, res) => {
//   db.collection('messages')
//   //will go to messages, find the document with the below name and msg, looks at the database, then updates the thumbUp.
//   .findOneAndUpdate({BookTitle: req.body.BookTitle, BookOwner: req.body.BookOwner, BorrowerName: req.body.BorrowerName, Date:req.body.Date}, {
//     $set: {
//       thumbUp:req.body.thumbUp + 1,
//       // thumbDown:req.body.thumbDown - 1
//     }
//   }, {
//     //sort allows you to sort top to bottom if the id is -1. It is bottom up if the id is 1. If the messages were exactly the same, whichever doc came firsts thumbUp # will be updated.
//     sort: {_id: -1},
//     upsert: true
//   }, (err, result) => {
//     if (err) return res.send(err)
//     res.send(result)
//   })
// })
//
// app.put('/messagesDown', (req, res) => {
//   db.collection('messages')
//   //will go to messages, find the document with the below name and msg, looks at the database, then updates the thumbUp.
//   .findOneAndUpdate({BookTitle: req.body.BookTitle, BookOwner: req.body.BookOwner, BorrowerName: req.body.BorrowerName, Date:req.body.Date}, {
//     $set: {
//       // thumbUp:req.body.thumbUp + 1,
//       thumbDown:req.body.thumbDown - 1
//     }
//   }, {
//     //sort allows you to sort top to bottom if the id is -1. It is bottom up if the id is 1. If the messages were exactly the same, whichever doc came firsts thumbUp # will be updated.
//     sort: {_id: -1},
//     upsert: true
//   }, (err, result) => {
//     if (err) return res.send(err)
//     res.send(result)
//   })
// })

app.delete('/messages', (req, res) => {
  db.collection('messages').findOneAndDelete({BookTitle: req.body.BookTitle, BookOwner: req.body.BookOwner, BorrowerName: req.body.BorrowerName, Date:req.body.Date}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})
