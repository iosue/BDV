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

router.put('/:userId',(req,res)=>{
  const {userId}=req.params,
        newData=req.body,
        user=db.users.find(u=>u.userId===userId)
  if (user) {
    const oldData={} //make a log of previous values of userData
    for (let attr in user) oldData[attr]=user[attr]

    for (let attr in newData) //for each attribute to be edited
      if (user[attr]===newData[attr]) delete newData[attr] //remove trivial updates
      else user[attr]=newData[attr] //update database entry

    //notify user of updates made
    if (Object.entries(newData).length) res.send(`user profile ${userId} updated:\n\n${Object.keys(newData).map(attr=>`${attr} changed from "${oldData[attr]}" to "${newData[attr]}"\n`).join('')}`)
    else res.send(`no novel changes detected for user profile ${userId}.`)
  } else res.send(`userId ${userId} not found in database.`)
})

router.get('/:userId',(req,res)=>{
  const userData=db.users.find(u=>u.userId===req.params.userId)
  if (userData) res.send(`view user data:\n\n${JSON.stringify(userData)}`)
  else res.send(`user data not found for id: ${req.params.userId}`)
})



router.post('/:userId/cart',(req,res)=>{
  const {userId}=req.params,
        {itemId,quantity} = req.body,
        user = db.users.find(u=>u.userId===userId),
        item = db.items.find(i=>i.itemId===itemId)
  if (user)
    if (item)
      if (quantity>0) {
        let itemAlreadyInCart=user.cart.find(i=>i.itemId===itemId)
        if (itemAlreadyInCart) itemAlreadyInCart.quantity=quantity
        else user.cart.push(req.body)
      } else return res.send(`ERROR: quantity in cart must be greater than zero`)
    else return res.send(`ERROR: item ${itemId} not found in catalogue.`)
  else return res.send(`ERROR: user ${userId} not found.`)
  res.send(`Item ${itemId} "${item.itemName}" x${item.quantity} successfully added to cart.`)
})


router.put('/:userId/cart/:itemId',(req,res)=>{
  const {userId,itemId}=req.params,
        {quantity} = req.body,
        user = db.users.find(u=>u.userId===userId),
        item = user.cart.find(i=>i.itemId===itemId)
  if (user)
    if (item)
      if (quantity>0) itemAlreadyInCart.quantity=quantity
      else {
        user.cart.splice(user.cart.indexOf(item),1)
        return res.send(`Item ${itemId} removed from cart`)
      }
    else return res.send(`ERROR: item ${itemId} not found in catalogue.`)
  else return res.send(`ERROR: user ${userId} not found.`)
  res.send(`Item ${itemId} "${item.itemName}" x${item.quantity} successfully updated.`)
})


router.delete('/:userId/cart/:itemId',(req,res)=>{
  const {userId,itemId}=req.params,
        user = db.users.find(u=>u.userId===userId),
        item = user.cart.find(i=>i.itemId===itemId)
  if (user)
    if (item) {
      user.cart.splice(user.cart.indexOf(item),1)
      return res.send(`Item ${itemId} removed from cart`)
    } else return res.send(`ERROR: item ${itemId} not found in catalogue.`)
  else return res.send(`ERROR: user ${userId} not found.`)
})

router.get('/:id/cart',(req,res)=>{
  const userData=db.users.find(u=>u.userId===req.params.id)
  if (userData) {
    let cartTotal=0
    res.send(`view current cart state for user ${req.params.id}:\n\n${
      userData.cart.map(
        lineItem=>{
          const itemData=db.items.find(i=>i.itemId===lineItem.itemId),
                lineTotal=itemData.price*lineItem.quantity
          cartTotal+=lineTotal
          return JSON.stringify({
            id: lineItem.itemId,
            name: itemData.itemName,
            price: itemData.price,
            qty: lineItem.quantity,
            lineTotal: lineTotal
          },2)
        }
      ).join('\n')||'This cart is empty'
    }\n\n\t\tCart Total: ${cartTotal}`)
  } else res.send(`user data not found for id: ${req.params.id}`)
})

router.get('/:userId/orders',(req,res)=>{
  const userData=db.users.find(u=>u.userId===req.params.userId)
  if (userData) res.send(`view list of previous orders for user ${req.params.userId}:\n\n${JSON.stringify(userData.orders)}`)
  else res.send(`user data not found for id: ${req.params.userId}`)
})


module.exports=router