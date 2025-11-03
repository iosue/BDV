const express=require('express'), router=express.Router(),
      authors=require('../database/authors')

router.get('/',(req,res)=>{
  res.send(`view author list: \n\n${JSON.stringify(authors,null,2)}`)
})

router.post('/',(req,res)=>{
  const newAuthor=req.body,
        authorByName=authors.find(author=>JSON.stringify(author.authorName)===JSON.stringify(newAuthor.authorName))
  if (authorByName) { // if name provided is already found in database
    res.send(`${newAuthor.authorName} is already in use.\nNO ACTION TAKEN`)
  } else { // add new author
    newAuthor.authorId=authors[authors.length-1].authorId.replace(/(\d+)/,(m,q)=>String(Number(q)+1).padStart(3,0))
    authors.push(newAuthor)
    res.send(`${newAuthor.email} successfully added to database`+'\n\n'+JSON.stringify(newAuthor,null,2))
  }
  console.log(authors)
})

router.route('/:id')
  .get((req,res)=>{
    // search database for author with matching id
    const author=authors.find(a=>a.authorId===req.params.id)
    if (author) {
      res.send(`View author \n\n${JSON.stringify(author,null,2)}`)
    } else {
      res.send(`author with id "${req.params.id}" not found in database.\nNO ACTION TAKEN`)
    }
  })
  .put((req,res)=>{
    // search database for author with matching id
    const author=authors.find(a=>a.authorId===req.params.id),
          update=req.body, previous=JSON.stringify(author,null,2)
    if (author) {
      let authorByName=authors.find(author=>JSON.stringify(author.authorName)===JSON.stringify(newAuthor.authorName))
      if (authorByName&&authorByName!=author) {
        res.send(`The name ${update.authorName} is already in use by another author.\nNO ACTION TAKEN`)
      } else {
        Object.keys(update).forEach(key=>author[key]=update[key])
        res.send(`Update author from \n\n${previous}\n\nto\n\n${JSON.stringify(author,null,2)}`)
      }
    } else {
      res.send(`author with id "${req.params.id}" not found in database.\nNO ACTION TAKEN`)
    }
  })
  .delete((req,res)=>{
    // search database for author with matching id
    const author=authors.find(a=>a.authorId===req.params.id)
    if (author) {
      const index=authors.indexOf(book)
      authors.splice(index,1)
      res.send(`Permanently removed author from database \n\n${JSON.stringify(author,null,2)}`)
      console.log(authors)
    } else {
      res.send(`author with id "${req.params.id}" not found in database.\nNO ACTION TAKEN`)
    }
  })

module.exports=router