const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const path = require('path');           
const PORT = process.env.PORT || 5000;  

const app = express();

app.set('port', (process.env.PORT || 5000));

app.use(cors());
app.use(bodyParser.json());



// For Heroku deployment

// Server static assets if in production
if (process.env.NODE_ENV === 'production') 
{
  // Set static folder
  app.use(express.static('frontend/build'));

  app.get('*', (req, res) => 
 {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  });
}



// API endpoints

const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const url = process.env.MONGODB_URI;
const client = new MongoClient(url);
client.connect();
const database = process.env.MONGODB_DATABASE_STRING;

//Login
// incoming: login, password
// outgoing: id, firstName, lastName, error
app.post('/api/login', async (req, res, next) => 
{
 var error = '';

  const { login, password } = req.body;

  let loginLower = login.toLowerCase();

  const db = client.db(database);
  const results = await db.collection('Users').find({login:loginLower, password:password}).toArray();

  var id = -1;
  var fn = '';
  var ln = '';

  if(results.length > 0 )
  {
    //store seprate, auto-incrementing int in database
    id = results[0].userID;

    //just use the mongoDB unique ObjectID
    //id = results[0]._id;

    fn = results[0].firstName;
    ln = results[0].lastName;
  }

  var ret = { id:id, firstName:fn, lastName:ln, error:''};
  res.status(200).json(ret);
});

//Register new user
// incoming: login, password, firstName, lastName
// outgoing: userID, error
app.post('/api/register', async (req, res, next) =>
{	
  const { login, password, firstName, lastName } = req.body;

  const db = client.db(database);

  //Bad, slow and future bug causing way of incrementing the userID
  let userNum= await db.collection('Users').countDocuments();
  let loginLower = login.toLowerCase();

  const newUser = {login: loginLower, password:password, firstName:firstName, lastName:lastName, userID:userNum+1};
  var error = '';

  try
  {
    const result = db.collection('Users').insertOne(newUser);
  }
  catch(e)
  {
    error = e.toString();
  }

  const results = await db.collection('Users').find({login:login,password:password}).toArray();

  let id = -1;
  if(results.length > 0 )
  {
    id = results[0].userID;
  }

  var ret = { userID:id, error: error};
  res.status(200).json(ret);
});

//Add Card
// incoming: userId, color
// outgoing: error
app.post('/api/addcard', async (req, res, next) =>
{	
  const { userId, card } = req.body;

  const newCard = {Card:card,UserId:userId};
  var error = '';

  try
  {
    const db = client.db(database);
    const result = db.collection('Cards').insertOne(newCard);
  }
  catch(e)
  {
    error = e.toString();
  }

  var ret = { error: error };
  res.status(200).json(ret);
});

//Search cards
// incoming: userId, search
// outgoing: results[], error
app.post('/api/searchcards', async (req, res, next) => 
{
  var error = '';

  const { userId, search } = req.body;

  var _search = search.trim();
  
  const db = client.db(database);
  const results = await db.collection('Cards').find({"Card":{$regex:_search+'.*', $options:'ri'}}).toArray();
  
  var _ret = [];
  for( var i=0; i<results.length; i++ )
  {
    _ret.push( results[i].Card );
  }
  
  var ret = {results:_ret, error:error};
  res.status(200).json(ret);
});



app.listen(PORT, () => 
{
  console.log('Server listening on port ' + PORT);
});
