const express = require('express');
const mongoose = require('mongoose');
const bParser = require('body-parser');
const passport = require('passport');
const path = require('path');
const cors = require('cors');


const users = require('./routes/api/users');
const app = express(); 
  
app.use(bParser.urlencoded({extended: false}));
app.use(bParser.json());

 //For database configuration

const db = require('./config/keys').mongoURI;
 

 // Actually connecting
 mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

//Passport middleware
app.use(passport.initialize());
app.use(cors());

//Passport config
require('./config/passport')(passport);

 //Use routes
 app.use('/api/users',users);
 app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



 // Server static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

  

 const port = process.env.PORT || 3000;

 app.listen(port, ()=>console.log(`Server on port ${port}`)); 
 module.exports= app;