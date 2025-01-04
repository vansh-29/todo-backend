// user-vansh74177 , gEd2FhAGW0VwvuZV
// mongodb+srv://vansh74177:gEd2FhAGW0VwvuZV@cluster0.t9j29.mongodb.net/
require('dotenv').config();
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const path = require("path");
var cors = require('cors')
app.use(cors({
    origin: '*', // Replace with your frontend URL
    methods: 'GET,POST,PUT,DELETE',
    credentials : true
  }));

  
app.use(cookieParser());

  
app.use(express.json())
// require('./conn/conn')

app.get('/' , (req,res)=>{
    res.send("hello")
})

app.get("/", (req, res) => {
    app.use(express.static(path.resolve(__dirname, "frontend", "build")));
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });

const PORT = process.env.PORT || 1000; // Use the PORT environment variable or fall back to 1000 locally

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
  
const authRouter = require('./routes/authRouter')
app.use( '/auth' , authRouter)

const listRouter = require('./routes/listRouter')
app.use('/user' , listRouter )