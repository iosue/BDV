const express=require('express'),
      router=express.Router()

router.get('/',(req,res)=>{
  res.send(`view order list`)
})
router.get('/:id',(req,res)=>{
  const {id}=req.params
  res.send(`view order ${id}`)
})

module.exports=router