const express=require('express'),
      router=express.Router()

router.get('/',(req,res)=>{
  res.send(`view cart content`)
})
router.get('/:id',(req,res)=>{
  const {id}=req.params
  res.send(`view product ${id}`)
})

module.exports=router