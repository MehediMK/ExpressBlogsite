const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const postschema = require('../models/postschema')
const Post = new mongoose.model('post',postschema)

// // for Category
const categoryschema = require('../models/categoryschema')
const Category = new mongoose.model('category',categoryschema)

// for featured
const featuredSchema = require('../models/featured')
const featured = new mongoose.model('feature',featuredSchema)


// index page
router.get('/',(req,res)=>{

    Category.find((err, data) => {
        if (!err) { 

            Post.find((err,post)=>{
                if(!err){
                    featured.find((err,feature)=>{
                        if(!err){
        
                            res.render('base',{title:'Home Page',category:data,posts:post,features:feature})
                        }else{
                            console.log('Failed to retrieve the Course List: ' + err);
        
                        }
                    })
                }else{
                    console.log('Failed to retrieve the Course List: ' + err);

                }
            })

        } else {
            console.log('Failed to retrieve the Course List: ' + err);
        }
    });
})


// details page
router.get('/artical/:slug',(req,res)=>{
    // we can pass multipale params
    Post.findOne({'slug':req.params.slug},(err,data)=>{
        if (!err) {
            res.render('details',{title:'Details Page',post:data})

        } else {
            console.log('Failed to retrieve the Course List: ' + err);
        }
    })
    console.log(req.params.slug)
})


// post view by category
router.get('/category/:slug',(req,res)=>{
    // we can pass multipale params
    const getslug = req.params.slug.split('-').join(' ').toLocaleLowerCase()

    Post.find({'category':getslug},(err,data)=>{
        if (!err) {
            res.render('allpost',{title:'Details Page',posts:data})

        } else {
            console.log('Failed to retrieve the Course List: ' + err);
        }
    })
})



// for Add featured 
router.get('/addfeatured',(req,res)=>{
    res.render('addfeatured',{title:'Home'})

})


// image upload modules
const path = require('path');
const multer = require('multer');
let imagename = ""
// let imagename = __dirname+"/public/image/"
const upload = multer.diskStorage({
                        destination: __dirname+'../../public/images', 
                        filename: (req, file, cb) => {
                            const getfilename = file.fieldname + '_' + Date.now() + path.extname(file.originalname)
                            cb(null, getfilename)
                            imagename=getfilename
                            console.log("file name"+imagename)
                        }
                    });
const imageUpload = multer({
                        storage: upload,
                        limits: {
                          fileSize: 1000000*2 // 1000000 Bytes = 2 MB
                        },
                        fileFilter(req, file, cb) {
                          if (!file.originalname.match(/\.(png|jpg)$/)) { 
                             // upload only png and jpg format
                             return cb(new Error('Please upload a Image'))
                           }
                         cb(undefined, true)
                      }
                  }) 


router.post('/upload/featured', imageUpload.single('postimage'), async (req,res)=>{
const newfeatured = new featured({image:"/images/"+imagename})
await newfeatured.save((err)=>{
    if(err){
        res.status(500).json({
            error:'There was an error in database server'
        })
        console.log(err)
    }
    else{
        
        res.redirect('/admin')

        console.log('successfully data inserted')
        
    }
})
})







module.exports = router