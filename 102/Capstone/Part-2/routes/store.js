const express=require('express'),
      {neon}=require("@neondatabase/serverless"),
      sql=neon(process.env.DATABASE_URL),
      Store=express.Router()

Store.get('/',async(req,res)=>{
  try {
    const items = await sql`SELECT * FROM "Item_Family"`
    res.json(
      items.map(item=>({
        id:item.item_id,
        name:item.name
      }))
    )
  } catch (error) {
    console.error('Query failed:', error)
    res.status(500).send('Database query error')
  }
})

Store.get('/:item_id',async(req,res)=>{
  const {item_id}=req.params
  try {
    const items = await sql`SELECT * FROM "Item_Family" WHERE item_id=${item_id}`
    res.json(items[0])
  } catch (error) {
    console.error('Query failed:', error)
    res.status(500).send('Database query error')
  }
})

Store.get('/:item/:variant',async(req,res)=>{
  const {item,variant}=req.params
  try {
    const items = await sql`SELECT * FROM "Item_Family" AS f JOIN "Item_Variant" AS v ON f.item_id=v.item_id WHERE f.item_id=${item} AND "SKU"=${variant}`
    res.json(items[0])
  } catch (error) {
    console.error('Query failed:', error)
    res.status(500).send('Database query error')
  }
})

module.exports=Store