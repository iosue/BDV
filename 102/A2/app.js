const express=require('express'),
      orderRouter=require('./routes/orders'),
      app=express(), port=3000

app.get('/',(req,res)=>{
  res.send(`
    invalid endpoint.
    see valid list at http://localhost:3000/api
  `)
})
app.get('/api',(req,res)=>{
  res.send(`
    invalid endpoint.
    see orders at http://localhost:3000/api/orders
  `)
})

app.use('/api/orders',orderRouter)

app.listen(port)
