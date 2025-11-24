const express=require('express'),
      itemRouter=require('./routes/store'),
      cartRouter=require('./routes/cart'),
      orderRouter=require('./routes/orders'),
      procRouter=require('./routes/process'),
      app=express(), port=3000

// json parsing middleware
app.use(express.json())
// url-encoded form data parsing middleware
app.use(express.urlencoded({extended:true}))

// access to root directory returns redirect
app.get('/',(req,res)=>{
  res.redirect('/store')
})

// use routers to serve related endpoints
app.use('/store', itemRouter)
app.use('/cart', cartRouter)
app.use('/orders', orderRouter)
app.use('/process', procRouter)

// run app
app.listen(port)
