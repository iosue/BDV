const express=require('express'),
      router=express.Router()

router.get('/',(req,res)=>{
  res.send(`view product list`)
})
router.get('/:id',(req,res)=>{
  const {id}=req.params
  res.send(`view product ${id}`)
})

/*  
  full api implementation would include 
  admin-protected methods to create, edit,
  add and delete items from store catalogue
*/
module.exports=router