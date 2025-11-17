const express=require('express'), router=express.Router(),
      uuid=require('uuid'), newId=uuid.v4,
      db=require('../database')

router.get('/',(req,res)=>{
  res.send(`[admin-locked] view list of all customers`)
})

router.post('/',(req,res)=>{
  const newUserData=req.body
  if (db.users.find(u=>u.email===newUserData.email)) {
    res.send(`
      POST request to /users
      ERROR: The email address ${newUserData.customerId} is already in use.
    `)
  } else {
    newUserData.userId=newId() // uuid overridden below for simplicity of testing
    newUserData.userId=`U-${String(db.users.length+1).padStart(3,0)}`
    newUserData.orders=[]
    newUserData.cart=[]
    db.users.push(newUserData)
    res.send(`SUCCESSFULLY REGISTERED ${JSON.stringify(newUserData)}`)
  }
})

router.put('/:id',(req,res)=>{
  const {id}=req.params,
        newData=req.body,
        user=db.users.find(u=>u.userId===id)
  if (user) {
    const oldData={} //make a log of previous values of userData
    for (let attr in user) oldData[attr]=user[attr]

    for (let attr in newData) //for each attribute to be edited
      if (user[attr]===newData[attr]) delete newData[attr] //remove trivial updates
      else user[attr]=newData[attr] //update database entry

    //notify user of updates made
    if (Object.entries(newData).length) res.send(`user profile ${id} updated:\n\n${Object.keys(newData).map(attr=>`${attr} changed from "${oldData[attr]}" to "${newData[attr]}"\n`).join('')}`)
    else res.send(`no novel changes detected for user profile ${id}.`)
  } else res.send(`userId ${id} not found in database.`)
})

router.get('/:id',(req,res)=>{
  const userData=db.users.find(u=>u.userId===req.params.id)
  if (userData) res.send(`view user data:\n\n${JSON.stringify(userData)}`)
  else res.send(`user data not found for id: ${req.params.id}`)
})

router.get('/:id/orders',(req,res)=>{
  const userData=db.users.find(u=>u.userId===req.params.id)
  if (userData) res.send(`view user data:\n\n${JSON.stringify(userData.orders)}`)
  else res.send(`user data not found for id: ${req.params.id}`)
})


module.exports=router