const express=require('express'), router=express.Router(),
      users=require('../database/users')

router.get('/',(req,res)=>{
  res.send(`view user list: \n\n${JSON.stringify(users,null,2)}`)
})

router.post('/',(req,res)=>{
  const newUser=req.body,
        userByEmail=users.find(user=>user.email===newUser.email)
  if (userByEmail) { // if email provided is already found in database
    res.send(`Email ${newUser.email} is already in use.\nNO ACTION TAKEN`)
  } else { // add new user
    newUser.userId=users[users.length-1].userId.replace(/(\d+)/,(m,q)=>String(Number(q)+1).padStart(3,0))
    users.push(newUser)
    res.send(`${newUser.email} successfully added to database`+'\n\n'+JSON.stringify(newUser,null,2))
  }
  console.log(users)
})

router.route('/:id')
  .get((req,res)=>{
    // search database for user with matching id
    const user=users.find(u=>u.userId===req.params.id)
    if (user) {
      res.send(`View user \n\n${JSON.stringify(user,null,2)}`)
    } else {
      res.send(`User with id "${req.params.id}" not found in database.\nNO ACTION TAKEN`)
    }
  })
  .put((req,res)=>{
    // search database for user with matching id
    const user=users.find(u=>u.userId===req.params.id),
          update=req.body, previous=JSON.stringify(user,null,2)
    if (user) {
      let userByEmail=users.find(u=>u.email===update.email)
      if (userByEmail&&userByEmail!=user) {
        res.send(`Email "${update.email}" is already in use by another user.\nNO ACTION TAKEN`)
      } else {
        Object.keys(update).forEach(key=>user[key]=update[key])
        res.send(`Update user from \n\n${previous}\n\nto\n\n${JSON.stringify(user,null,2)}`)
      }
    } else {
      res.send(`User with id "${req.params.id}" not found in database.\nNO ACTION TAKEN`)
    }
  })
  .delete((req,res)=>{
    // search database for user with matching id
    const user=users.find(u=>u.userId===req.params.id)
    if (user) {
      const index=users.indexOf(book)
      users.splice(index,1)
      res.send(`Permanently removed user from database \n\n${JSON.stringify(user,null,2)}`)
      console.log(users)
    } else {
      res.send(`User with id "${req.params.id}" not found in database.\nNO ACTION TAKEN`)
    }
  })

module.exports=router