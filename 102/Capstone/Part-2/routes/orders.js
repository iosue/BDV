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

Orders.get('/:order_id',async(req,res)=>{
  const {order_id}=req.params
  try {
    const orders=await sql`SELECT * FROM "Order" WHERE order_id=${order_id}`,
          order_details=orders[0]
    order_details.line_items=await sql`
      SELECT * 
      FROM "Order_Line" AS "ol" 
      JOIN "Item_Variant" AS "iv" 
      ON "ol"."SKU"="iv"."SKU"
      JOIN "Item_Family" AS "if" 
      ON "if"."item_id"="iv"."item_id"
      WHERE order_id=${order_id}`
    res.json(order_details)
  } catch (error) {
    console.error('Query failed:', error)
    res.status(500).send('Database query error')
  }
})

Orders.get('/:order/:line',async(req,res)=>{
  const {order,line}=req.params
  try {
    const lines=await sql`SELECT * FROM "Order_Line" WHERE order_id=${order} AND line_id=${line}`
    res.json(lines[0])
  } catch (error) {
    console.error('Query failed:', error)
    res.status(500).send('Database query error')
  }
})


module.exports=Orders
