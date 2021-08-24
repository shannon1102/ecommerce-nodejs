'use strict'

const express = require('express')
const MysqlDB = require('../../models/mysql')
const {checkRequiredFieldInBody} = require('../../middleware')
const PostService = require('../../services/postService/postService')

const { verifyToken,adminRole } = require('../../middleware/verifyToken')
const  upload = require('../../utils/uploadHost')
const cloudinary = require('cloudinary')
const {upLoadCloudinary} = require('../../utils/upLoadCloudinary')
const postApi = express.Router()
const mysqlDb = new MysqlDB()
const postService = new PostService(mysqlDb)
// cloudinary.config({ 
//     cloud_name: process.env.CLOUD_NAME, 
//     api_key: process.env.API_KEY, 
//     api_secret: process.env.API_SECRET 
// })

// const storage = multer.memoryStorage()
// const upload = multer({ storage: storage })

postApi.get('/', async (req, res, next) => {
    try {
        let {postsPerPage, pageNumber, orderType} = req.query
        const postsFounded = await postService.getPosts(postsPerPage, pageNumber, orderType)

        return res.status(200).json({status:200,message:"Success",data: postsFounded})
    } catch (error) {
        return res.status(500).json({status:500,message: error})
    }
})

postApi.get('/:id', async (req, res, next) => {
    try {
        let {id} = req.params
        const postFounded = await postService.getPostById(id)

        return res.status(200).json({status:200,message:"Success",data:postFounded})
    } catch (error) {
        return res.status(500).json({status:500,message: error})
    }
})
postApi.get('/get-by-slug/:slug', async (req, res, next) => {
    try {
        let {slug} = req.params
        const postFounded = await postService.getPostBySlug(slug)

        return res.status(200).json({status:200,message:"Success",data:postFounded})
    } catch (error) {
        return res.status(500).json({status:500,message: error})
    }
})
postApi.get('/get-by-tag-id/:tag_id', async (req, res, next) => {
    try {
        let {tag_id} = req.params
        const postFounded = await postService.getPostByTagId(tag_id)

        return res.status(200).json({status:200,message:"Success",data:postFounded})
    } catch (error) {
        return res.status(500).json({status:500,message: error})
    }
})
postApi.get('/get-by-tag-name/:name', async (req, res, next) => {
    try {
        let {name} = req.params
        const postFounded = await postService.getPostByTagName(id)

        return res.status(200).json({status:200,message:"Success",data:postFounded})
    } catch (error) {
        return res.status(500).json({status:500,message: error})
    }
})
postApi.get('/get-by-tag-slug/:tag_slug', async (req, res, next) => {
    try {
        let {tag_slug} = req.params
        const postFounded = await postService.getPostByTagSlug(tag_slug)

        return res.status(200).json({status:200,message:"Success",data:postFounded})
    } catch (error) {
        return res.status(500).json({status:500,message: error})
    }
})

postApi.post('/',verifyToken,adminRole,upload.single('image'),async (req, res, next) => {
        
        try {
            let {title,url_image, content,tag_id} = req.body
            if(req.file) {
                await upLoadCloudinary(req.file.path)
                .then(result=> {
                    console.log(result)
                    url_image = result.secure_url;
                    let image_public_id = result.public_id;
                    console.log("1")
                })
                .catch(err=>{
                    console.log(err)
                })
            }else {
                url_image = null
            } 
            console.log("222") ;          
            const insertedId = await postService.createPost(title,url_image,content,tag_id)
            console.log("3")
            return res.status(200).json({status:200,message: 'Create new post successfully'})
        } catch (error) {
            return res.status(500).json({status:500,message: error})
        }
})

postApi.put('/:id',verifyToken,adminRole,upload.single('image'),
    async (req, res, next) => {
        let {title,url_image,content,tag_id} = req.body
        let {id} = req.params
        try {
            console.log(req.body);
            
            console.log(req.file)
            if(req.file) {
                await upLoadCloudinary(req.file.path)
                .then(result=> {
                    console.log(result)
                    url_image = result.secure_url;
                    let image_public_id = result.public_id;
                })
                .catch(err=>{
                    console.log(err)
                })
            }else {
                url_image = null
            }            
            await postService.updatePost(id, title,url_image, content,tag_id)

            return res.status(200).json({message: 'updated post successfully'})
        } catch (error) {
            return res.status(500).json({status:500,message: error})
        }
    })

    postApi.delete('/:id',verifyToken,adminRole,
    async (req, res, next) => {
        let {id} = req.params
        try {
            await postService.deletePost(id)

            return res.status(200).json({message: 'removed post successfully'})
        } catch (error) {
            return res.status(500).json({status:500,message: error})
        }
    })

module.exports = postApi