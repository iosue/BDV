const express=require('express'),
      router=express.Router()

router.get('/',(req,res)=>{
  res.send(`view order list`)
})
router.get('/:order',(req,res)=>{
  const {order}=req.params
  res.send(`view order ${order}`)
})
router.get('/:order/:item',(req,res)=>{
  const {order,item}=req.params
  res.send(`view item ${item} from ${order}`)
})

module.exports=router