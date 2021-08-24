'use strict'
const express = require('express');
const MysqlDB = require('../../models/mysql');
const ProductService = require('../../services/productService/productService');
const productApi = express.Router();
const mysqlDb = new MysqlDB();
const productService = new ProductService(mysqlDb);
const {checkRequiredFieldInBody,checkRequiredFieldInQuery} = require('../../middleware/index')
const {verifyToken,adminRole} = require('../../middleware/verifyToken');
const {removeAccent} =  require('../../utils/index');
const upload = require('../../utils/uploadHost');
const {upLoadCloudinary} = require('../../utils/upLoadCloudinary');
const { resolve } = require('path');

productApi.get('/', (req,res,next) => {
    let {minPrice,maxPrice,productsPerPage,pageNumber,orderType,search} = req.query;
    productService
    .getProducts(minPrice,maxPrice,productsPerPage,pageNumber,orderType,search)
    .then(listProduct => {
        return res.status(200).json({status:200,message:"Success",data: listProduct})
    })
    .catch(err=>{
        return res.status(500).json({status:500,message: err})
    })

})
productApi.get('/get-by-category-id/:category_id', (req,res,next) => {
    
    let {category_id} = req.params
    console.log(category_id);
    let {productsPerPage,pageNumber,orderType,search} = req.query;
    productService
    .getProductsByCategoryId(category_id,productsPerPage,pageNumber,orderType,search)
    .then(listProduct => {
        return res.status(200).json({status:200,message:"Success",data: listProduct})
    })
    .catch(err=>{
        return res.status(500).json({status:500,message: err})
    })

})
productApi.get('/get-by-category-slug/:category_slug', (req,res,next) => {
    
    let {category_slug} = req.params

    console.log(category_slug);
    let {productsPerPage,pageNumber,orderType,search} = req.query;
    productService
    .getProductsByCategorySlug(category_slug,productsPerPage,pageNumber,orderType,search)
    .then(listProduct => {
        return res.status(200).json({status:200,message:"Success",data: listProduct})
    })
    .catch(err=>{
        return res.status(500).json({status:500,message: err})
    })

})


// productApi.get('/get-by-category-id/:category_id', (req,res,next) => {
    
//     let {category_id} = req.params
//     console.log(category_id);
//     let {productsPerPage,pageNumber,orderType,search} = req.query;
//     productService
//     .getProductsByCategoryId(category_id,productsPerPage,pageNumber,orderType,search)
//     .then(listProduct => {
//         return res.status(200).json({status:200,message:"Success",data: listProduct})
//     })
//     .catch(err=>{
//         return res.status(500).json({status:500,message: err})
//     })

// })

// productApi.get('/get-by-category-name/',checkRequiredFieldInQuery(['main_category', 'category']), (req,res,next) => {
    
//     let {main_category, category,productsPerPage,pageNumber,orderType,search} = req.query;
//     productService
//     .getProductsByCategoryName(main_category, category,productsPerPage,pageNumber,orderType,search)
//     .then(listProduct => {
//         return res.status(200).json({status:200,message:"Success",data: listProduct})
//     })
//     .catch(err=>{
//         return res.status(500).json({status:500,message: err})
//     })

// })

productApi.get('/:id',(req,res,next)=>{
    let {id} = req.params
    console.log(id)
    productService
    .getProductById(id)
    .then(listProduct=>{
        return res.status(200).json({status:200,message:"Success",data: listProduct})
        })
    .catch(err=>{
        return res.status(500).json({status:500,message: err})
    })  
})
productApi.get('/get-by-slug/:slug',(req,res,next)=>{
    let {slug} = req.params
    console.log(slug)
    productService
    .getProductBySlug(slug)
    .then(listProduct=>{
        return res.status(200).json({status:200,message:"Success",data: listProduct})
        })
    .catch(err=>{
        return res.status(500).json({status:500,message: err})
    })  
})
productApi.post('/',verifyToken,adminRole,upload.array('list_product_images',4),async (req,res,next)=>{
    try{
        let {name,description,detail,price,discount,category_id} = req.body
        const listFile = req.files
        console.log(listFile)
        let list_product_images = []
        if(!listFile) {
            list_product_images = []
        } else {
            for(let i=0;i<listFile.length;i++) {
                await upLoadCloudinary(listFile[i].path)
                .then(result=>{
                    console.log(result.secure_url);
                    console.log("1");
                    list_product_images.push(result.secure_url);
                })
                .catch(err=>console.log(err))

            }
        }
        console.log("alo",list_product_images);
                productService
                .createProduct(name, description, detail,list_product_images, price, discount, category_id)
                .then(() => { 
                    console.log("alo2",list_product_images);  
                            return res.status(200).json({
                                status:200,
                                message: 'Post new product successfully'
                            })
                })
                .catch(err => {
                            return res.status(500).json({status:500,message: err})
                })
                
    }catch(error){
        console.log(error);
        return res.status(500).json({"err": error})
    }
   
})
productApi.put('/:id',verifyToken,adminRole,upload.array('list_product_images',4),async (req,res,next)=>{
    try{
    let {id} = req.params
    let {name,description,detail,price,discount,category_id} = req.body
        const listFile = req.files
        console.log(listFile)
        let list_product_images = []
        if(!listFile) {
            list_product_images = []
        } else {
            for(let i=0;i<listFile.length;i++) {
                await upLoadCloudinary(listFile[i].path)
                .then(result=>{
                    console.log(result.secure_url);
                    console.log("1");
                    list_product_images.push(result.secure_url);
                })
                .catch(err=>console.log(err))

            }
        }

    productService
    .updateProduct(id,name,description,detail,list_product_images,price,discount,category_id)
    .then(result=>{
        return res.status(200).json({  
            status:200,
            message: "Update product successfully",
            data:result
            })
        })
    .catch(err=>{
        return res.status(500).json({status:500,message: err})
    })
}catch(error){
    console.log(error);
    return res.status(500).json({"err": error})
}  
})
productApi.delete('/:id',verifyToken,adminRole,(req,res,next)=>{
    let {id} = req.params
    productService
    .deleteProduct(id)
    .then(result=>{
        return res.status(200).json({
            status:200,
            message: 'Detele product sucessfully',
            })
    })
    .catch(err=>{
        return res.status(500).json({status:500,message: err})
    })  
})

module.exports = productApi;