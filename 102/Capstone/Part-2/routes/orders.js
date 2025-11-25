const express=require('express'),
      {neon}=require("@neondatabase/serverless"),
      sql=neon(process.env.DATABASE_URL),
      formatSQL=require('pg-format'),
      // customFormat=require('./custFormat'),
      Orders=express.Router()

const formatTimeStamp=(stamp)=>{
  const yyyy=String(stamp.getFullYear()).padStart(4,0),
        MM=String(stamp.getMonth()+1).padStart(2,0),
        dd=String(stamp.getDate()).padStart(2,0),
        hh=String(stamp.getHours()).padStart(2,0),
        mm=String(stamp.getMinutes()).padStart(2,0),
        ss=String(stamp.getSeconds()).padStart(2,0),
        tzh=String(Math.floor(stamp.getTimezoneOffset()/60)).padStart(2,0),
        tzm=String(Math.floor(stamp.getTimezoneOffset()%60)).padStart(2,0)
  return `${yyyy}-${MM}-${dd}T${hh}:${mm}:${ss}+${tzh}:${tzm}`
}

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

Orders.post('/',async(req,res)=>{
  const order_data=req.body
  // expected format
  //   {
  //     "user_id": 1,
  //     "payer_id": 0,
  //     "shipping_address": 1,
  //     "line_items": [
  //       {
  //         "SKU": 1001000,
  //         "qty": 2,
  //         "discount_type": "percent",
  //         "discount_amount": 5
  //       },
  //       {
  //         "SKU": 1002051,
  //         "qty": 1,
  //         "discount_type": "flat",
  //         "discount_amount": 15.00
  //       }
  //     ]
  //   } 

      let tests={
        User:['user_id','user_id'],
        User_Pay:['payer_id','payer_id'],
        Address:['shipping_address','address_id']
      }
      for (const table in tests) {
        const col=tests[table][1],
              val=order_data[tests[table][0]],
              query=formatSQL('SELECT * FROM %I WHERE %I = %L',table,col,val)
        console.log(query)
        try {
          const result=await sql`${sql.unsafe(query)}`
          if (!result.length) return res.send(`invalid ${col}. Cannot process order.`)
          tests[table]=result[0]
        } catch (err) {
          console.error(err)
          return res.send(`Error processing ${table}`)
        }
      }
      console.log(tests)

  order_data.order_date=formatTimeStamp(new Date())
  order_data.status=0

  const lineItems=order_data.line_items
  for (const line_data of lineItems) {

    let query=formatSQL('INSERT INTO "Order_Line" (%I) VALUES (%L)',Object.keys(line_data),Object.values(line_data))
    console.log(query)
    await sql`${sql.unsafe(query)}`
  }

  delete order_data.line_items

  let query=formatSQL('INSERT INTO "Order" (%I) VALUES (%L)',Object.keys(order_data),Object.values(order_data))
  console.log(query)
  await sql`${sql.unsafe(query)}`
  res.send(`Order Successfully added to database; awaiting payment processing...\n\n${JSON.stringify(order_data)}`)
})

Orders.put('/:order_id',async(req,res)=>{
  const {order_id}=req.params,
        status_update=req.body.status
  try {
    let query=formatSQL(`
      UPDATE "Order"
      SET "status" = ${status_update}
      WHERE "order_id" = ${order_id};`)
    await sql`${sql.unsafe(query)}`
    query=formatSQL(`SELECT * FROM "Order_Status" WHERE "status_code" = ${status_update}`)
    let status_name=(await sql`${sql.unsafe(query)}`)[0].status
    res.json(`order ${order_id} status updated to ${status_update}: ${status_name}`)
  } catch (error) {
    console.error('Query failed:', error)
    res.status(500).send('Database query error')
  }
})

module.exports=Orders
