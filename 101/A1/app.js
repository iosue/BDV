const express=require('express'),
      userRouter=require('./routes/users'),
      authorRouter=require('./routes/authors'),
      libraryRouter=require('./routes/library'),
      app=express(), port=3000

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))

app.use('/store/users',userRouter)
app.use('/store/authors',authorRouter)
app.use('/store/library',libraryRouter)

app.listen(port)
console.log(`app.js is running at http://localhost:${port}`)