const express=require('express'),
      router=express.Router()

router.get('/',(req,res)=>{
  res.send(`view product list`)
})
router.get('/:item',(req,res)=>{
  const {item}=req.params
  res.send(`view product family ${item}`)
})
router.get('/:item/:variant',(req,res)=>{
  const {item,variant}=req.params
  res.send(`view product variant ${item}:${variant}`)
})

/*  
  full api implementation would include 
  admin-protected methods to create, edit,
  add and delete items from store catalogue
*/
module.exports=router