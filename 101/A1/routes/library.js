const express=require('express'), router=express.Router(),
      library=require('../database/library'),
      authors=require('../database/authors')

router.get('/',(req,res)=>{
  res.send(`view book catalogue: \n\n${JSON.stringify(library,null,2)}`)
})

router.post('/',(req,res)=>{
  const book=req.body,
        authorById=authors.find(author=>author.authorId===book.authorId),
        authorByName=authors.find(author=>JSON.stringify(author.authorName)===JSON.stringify(book.authorName))

  if (authorById) { // id authorId is provided, update authorName to existing author entry
    book.authorName=authorById.authorName
    checkForDuplicate()
  } else if (authorByName) { //if ONLY authorName is provided, update authorId to existing entry
    book.authorId=authorByName.authorId
    checkForDuplicate()
  } else { // neither authorId nor authorName can be found in existing database
    res.send( `neither provided authorId nor authorName can be found in existing database`
      +'\n'+`NO ACTION TAKEN`+'\n\n'+JSON.stringify(book,null,2))
  }
  console.log(library)
  function checkForDuplicate() { 
    if (library.find(existing=>{
      return (existing.title    === book.title
        &&  existing.year     === book.year
        &&  existing.authorId === book.authorId )
      })) { // if book with matching title, year and authorId already exists in library:
      res.send( `book with title "${book.title}" by ${book.authorName.join(', ')} already exists in library`
        +'\n'+`NO ACTION TAKEN`+'\n\n'+JSON.stringify(book,null,2))
    } else { // else, publish
      // assign bookId as an increment on the current last book (highest id number) in library
      book.bookId=library[library.length-1].bookId.replace(/(\d+)/,(m,q)=>String(Number(q)+1).padStart(3,0))
      library.push(book)
      res.send(`SUCCESSFULLY ADDED "${book.title}" TO LIBRARY`+'\n\n'+JSON.stringify(book,null,2))
    }
  }
})

router.route('/:id')
  .get((req,res)=>{
    // search library for book with matching id; if not found, treat id as ISBN and search again
    const book=library.find(book=>book.bookId===req.params.id||book.ISBN===req.params.id)
    if (book) {
      res.send(`View book \n\n${JSON.stringify(book,null,2)}`)
    } else {
      res.send(`Book with bookId or ISBN "${req.params.id}" not found in Library.\nNO ACTION TAKEN`)
    }
  })
  .put((req,res)=>{
    // search library for book with matching id; if not found, treat id as ISBN and search again
    const book=library.find(book=>book.bookId===req.params.id||book.ISBN===req.params.id),
          update=req.body, previous=JSON.stringify(book,null,2)
    if (book) {
      /*
      =================================================================
          here there should be extensive logic to ensure that 
          the update contains no duplicates or errors;
          similar to the logic under POST, above.
          This would be implemented with further development.
      =================================================================
      */
      Object.keys(update).forEach(key=>book[key]=update[key]) // NAIVE UPDATE to be rewritten
      res.send(`Update book from \n\n${previous}\n\nto\n\n${JSON.stringify(book,null,2)}`)
    } else {
      res.send(`Book with bookId or ISBN "${req.params.id}" not found in Library.\nNO ACTION TAKEN`)
    }
  })
  .delete((req,res)=>{
    // search library for book with matching id; if not found, treat id as ISBN and search again
    const book=library.find(book=>book.bookId===req.params.id||book.ISBN===req.params.id)
    if (book) {
      const index=library.indexOf(book)
      library.splice(index,1)
      res.send(`Permanently removed book from library \n\n${JSON.stringify(book,null,2)}`)
      console.log(library)
    } else {
      res.send(`Book with bookId or ISBN "${req.params.id}" not found in Library.\nNO ACTION TAKEN`)
    }
  })

module.exports=router