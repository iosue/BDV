const express=require('express'),
      {neon}=require("@neondatabase/serverless"),
      sql=neon(process.env.DATABASE_URL),
      Orders=express.Router()

Orders.get('/',async(req,res)=>{
  try {
    const orders = await sql`SELECT * FROM "Order"`
    res.json(orders)
  } catch (error) {
    console.error('Query failed:', error)
    res.status(500).send('Database query error')
  }
})

Orders.get('/:item_id',async(req,res)=>{
  const {item_id}=req.params
  try {
    const items = await sql`SELECT * FROM "Item_Family" WHERE item_id=${item_id}`
    res.json(items[0])
  } catch (error) {
    console.error('Query failed:', error)
    res.status(500).send('Database query error')
  }
})

Orders.get('/:item/:variant',async(req,res)=>{
  const {item,variant}=req.params
  try {
    const items = await sql`SELECT * FROM "Item_Family" AS f JOIN "Item_Variant" AS v ON f.item_id=v.item_id WHERE f.item_id=${item} AND "SKU"=${variant}`
    res.json(items[0])
  } catch (error) {
    console.error('Query failed:', error)
    res.status(500).send('Database query error')
  }
})

module.exports=Orders



// const express=require('express'),
//       {neon}=require("@neondatabase/serverless"),
//       sql=neon(process.env.DATABASE_URL),
//       router=express.Router()

// router.get('/',(req,res)=>{
//   res.send(`view order list`)
// })
// router.get('/:order',(req,res)=>{
//   const {order}=req.params
//   res.send(`view order ${order}`)
// })
// router.get('/:order/:item',(req,res)=>{
//   const {order,item}=req.params
//   res.send(`view item ${item} from ${order}`)
// })

// module.exports=router