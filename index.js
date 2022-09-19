require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

const post = require('./routers/post')
const category = require('./routers/category')
const admin = require('./routers/admin')
const base = require('./routers/base')





const app = express()
const port = process.env.PORT

app.use(express.static(__dirname + '/public'));
// set the view engine to ejs
app.set('view engine', 'ejs');

// for request json and body
app.use(express.json())
app.use(express.urlencoded())

// for mongoose uri connection
mongoose.connect(process.env.URI)
.then(()=>{
    console.log('Database succesfully connected...')
})
.catch(error => handleError(error));


app.use('/',base)
app.use('/admin',admin)
app.use('/post',post)
app.use('/category',category)



app.listen(port,()=>{
    console.log(`Server running at http://localhost:${port}`)
})