const express=require('express'),
      userRouter=require('./routes/users'),
      itemRouter=require('./routes/items'),
      app=express(), port=3000

// json parsing middleware
app.use(express.json())
// url-encoded form data parsing middleware
app.use(express.urlencoded({extended:true}))

// access to root directory returns redirect
app.get('/',(req,res)=>{
  res.redirect('/store/items')
})
// access to api directory returns redirect
app.get('/store',(req,res)=>{
  res.redirect('/store/items')
})

// use routers to serve related endpoints
app.use('/store/users',userRouter)
app.use('/store/items',itemRouter)

// run app
app.listen(port)
