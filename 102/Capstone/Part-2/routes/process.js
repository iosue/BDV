const express=require('express'),
      {neon}=require("@neondatabase/serverless"),
      sql=neon(process.env.DATABASE_URL),
      router=express.Router()

router.post('/',(req,res)=>{
  // send request to process payment, then redirect to "/orders/:id"
})

module.exports=router