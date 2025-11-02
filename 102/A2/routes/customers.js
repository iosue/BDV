const express=require('express'),
      router=express.Router()

router.get('/',(req,res)=>{
  res.send(`view customer list`)
})
router.get('/:id',(req,res)=>{
  const {id}=req.params
  res.send(`view customer ${id}`)
})

module.exports=router