const express = require("express");
const app = express();
require('dotenv').config();
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors());

require('./models/index');
require('./routes/public.route')(app);



const port = process.env.PORT || 8000;
app.listen(port,()=>{
console.log(`Server is running at port ${port}`);
})