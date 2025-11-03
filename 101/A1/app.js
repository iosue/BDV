const express=require('express'),
      app=express(), port=3000,
      library=require('./database/library'),
      users=require('./database/users')

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))

app.listen(port)
console.log(`app.js is running at http://localhost:${port}`)