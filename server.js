var express =require('express');
var cors = require('cors');//add in cors
var bodyParser = require('body-parser');
var path = require('path');
import mongoose from 'mongoose';
import routes from './routes/1564routes';//here you cannot use require
import { mongoUri, secret } from './config/keys';
import jsonwebtoken from 'jsonwebtoken';
import User from './models/userModel'; //i'm pretty sure this is wrong
//nodemon ./server.js --exec babel-node -e js &&

require("dotenv").config()
var app = express();
const port = process.env.PORT || 8080;
//const secret = process.env.SECRET || 'RESTFULAPIs';
//mongoose connection
mongoose.Promise = global.Promise;
mongoose.connect(mongoUri, { useNewUrlParser: true });

app.use(cors());
app.use(express.static(path.join(__dirname, "client","build")));
app.use(bodyParser.json()); //let the body parser know that we expect json to be coming in with http requests to the server
app.use(bodyParser.urlencoded({extended: true}));
app.use((req, res, next) => {
  if(req.headers && req.headers.authorization
    && req.headers.authorization.split(' ')[0] === 'JWT') {
      jsonwebtoken.verify(req.headers.authorization.split(' ')[1], secret,
    (err, decode) => {
      if(err) req.user = undefined;
      req.user = decode;
      next();
    });
  } else {
    req.user = undefined;
    next();
  }
});
app.get("*", (req, res) => {  
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});


routes(app);


var server = app.listen(port
  ,()=>{
  console.log("server is listening on port" + server.address().port);
})
