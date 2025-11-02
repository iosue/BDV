const express=require('express'), router=express.Router(),
      uuid=require('uuid'), newId=uuid.v4,
      db=require('../database')

router.post('/',(req,res)=>{
  const order=req.body
  if (db.customers.find(c=>c.customerId===order.customerId)) {
    order.orderId=newId()
    order.status="pending"
    order.subtotal=order.items.reduce(
      (sum,item)=>{
        const product=db.products.find(p=>p.productId===item.productId)
        return sum + product.price*item.quantity
      },0
    )
    order.total=1.15*order.subtotal
    db.orders.push(order)
    res.send(`
      SUCCESSFULLY ADDED ORDER:
      ${JSON.stringify(order)}
    `)
  } else {
    res.send(`
      POST request to /orders/
      ERROR: customerID ${order.customerId} does not exist
      Select from ids [${db.customers.map(c=>c.customerId)}] or create new customer
    `)
  }
})

router.get('/',(req,res)=>{
  res.send(`view order list: ${JSON.stringify(db.orders)}`)
})

router.route('/:id')
  .get((req,res)=>{
    const {id}=req.params,
          order=db.orders.find(o=>o.orderId===id)
    if (order) {
      res.send(`
        view order:
        ${JSON.stringify(order)}
      `)
    } else {
      res.send(`orderId: ${id} does not exist`)
    }
  })
  .put((req,res)=>{
    const {id}=req.params,
          update=req.body,
          order=db.orders.find(o=>o.orderId===id)
    if (order) {
      Object.keys(update).forEach(
        key=>order[key]=update[key]
      )
      order.subtotal=order.items.reduce(
        (sum,item)=>{
          const product=db.products.find(p=>p.productId===item.productId)
          return sum + product.price*item.quantity
        },0
      )
      order.total=1.15*order.subtotal
      res.send(`
        SUCCESSFULLY UPDATED ORDER:
        ${JSON.stringify(order)}
      `)
    } else {
      res.send(`orderId: ${id} does not exist`)
    }
  })
  .delete((req,res)=>{
    console.log(db)
    const {id}=req.params,
          index=db.orders.findIndex(o=>o.orderId===id)
    if (index>-1) {
      db.orders.splice(index,1)
      res.send(`SUCCESSFULLY DELETED ORDER: ${id}`)
      console.log(db)
    } else {
      res.send(`orderId: ${id} does not exist`)
    }
  })

module.exports=router