//KYIV MEDIA 20.11.19
const express = require('express');
const graphqlHTTP = require('express-graphql'); 
const schema = require('../schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 3005;
//you have to add your own db
mongoose.connect('mongodb+srv://yourloginhere:yourpasswordhere@cluster0-mtugh.mongodb.net/graphql-db?retryWrites=true&w=majority',{ useNewUrlParser: true });

app.use(cors());

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true,
}));



const dbConnection = mongoose.connection;
dbConnection.on('error',err => console.log('Connection error: ${err}'));
dbConnection.once('open', () => console.log('Connected to DB'));

app.listen(PORT, err=>{
    err ? console.log(error) : console.log("Server started");
});