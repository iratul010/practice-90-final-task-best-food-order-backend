const express = require('express');
const app = express();
const port = 5000;
const cors = require('cors');
app.use(cors())
app.get('/',(req,res)=>{
      res.send('server start')
}) 


app.listen(port,(req,res)=>{
  console.log('App is listening on ',port)
})