const express=require('express'),
      orderRouter=require('./routes/orders'),
      productRouter=require('./routes/products'),
      customerRouter=require('./routes/customers'),
      app=express(), port=3000

// json parsing middleware
app.use(express.json())
// url-encoded form data parsing middleware
app.use(express.urlencoded({extended:true}))

// access to root directory returns redirect
app.get('/',(req,res)=>{
  res.send(`
    invalid endpoint.
    see valid list at http://localhost:3000/petesza
  `)
})
// access to api directory returns redirect
app.get('/petesza',(req,res)=>{
  res.send(`
    Pete's 'Za
    see order list at /petesza/orders
    see product list at /petesza/products
    see customer list at /petesza/customers
  `)
})

// use routers to serve related endpoints
app.use('/petesza/orders',orderRouter)
app.use('/petesza/products',productRouter)
app.use('/petesza/customers',customerRouter)

// run app
app.listen(port)
