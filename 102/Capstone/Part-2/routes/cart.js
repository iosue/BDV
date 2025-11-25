const express=require('express'),
      {neon}=require("@neondatabase/serverless"),
      sql=neon(process.env.DATABASE_URL),
      Cart=express.Router()

Cart.get('/',async(req,res)=>{
  try {
    const items = await sql`SELECT * FROM "Cart"`
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

Cart.get('/:item_id',async(req,res)=>{
  const {item_id}=req.params
  try {
    const items = await sql`SELECT * FROM "Item_Family" WHERE item_id=${item_id}`
    res.json(items[0])
  } catch (error) {
    console.error('Query failed:', error)
    res.status(500).send('Database query error')
  }
})

Cart.get('/:item/:variant',async(req,res)=>{
  const {item,variant}=req.params
  try {
    const items = await sql`SELECT * FROM "Item_Family" AS f JOIN "Item_Variant" AS v ON f.item_id=v.item_id WHERE f.item_id=${item} AND "SKU"=${variant}`
    res.json(items[0])
  } catch (error) {
    console.error('Query failed:', error)
    res.status(500).send('Database query error')
  }
})

module.exports=Cart






// const express=require('express'),
//       {neon}=require("@neondatabase/serverless"),
//       sql=neon(process.env.DATABASE_URL),
//       Cart=express.Router()



// Cart.get('/',(req,res)=>{
//   res.send(`view cart content`)
// })

// Cart.post('/',(req,res)=>{
//   res.send('i hear you')
// })




// Cart.get('/:line',(req,res)=>{
//   const {line}=req.params
//   res.send(`view line item ${line}`)
// })

// Cart.put('/:line',(req,res)=>{
//   const {line}=req.params
//   res.send(`edit line item ${line}`)
// })

// Cart.delete('/:line',(req,res)=>{
//   const {line}=req.params
//   res.send(`remove line-item ${lined} from cart`)
// })



// module.exports=Cart