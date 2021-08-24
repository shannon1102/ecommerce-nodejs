'use strict'
const express = require('express');
const MysqlDB = require('../../models/mysql');
const InquiryService = require('../../services/inquiryService/inquiryService');
const inquiryApi = express.Router();
const mysqlDb = new MysqlDB();
const inquiryService = new InquiryService(mysqlDb); 
const {checkRequiredFieldInBody} = require('../../middleware/index');
const {verifyToken,adminRole} = require('../../middleware/verifyToken');


inquiryApi.get('/',verifyToken,adminRole, (req,res,next) => {
    let {itemsPerPage,pageNumber,orderType} = req.query;
    inquiryService
    .getInquiries(itemsPerPage,pageNumber,orderType)
    .then(listInquiry => {
        res.status(200).json({status:200, message:"Success",data: listInquiry})
    })
    .catch(err=>{
        return res.status(500).json({status:200,message: err})
    })

})
inquiryApi.get('/get-by-category-id/:category_id',verifyToken,adminRole, (req,res,next) => {
    
    let {category_id} = req.params
    console.log(category_id);
    let {inquiryPerPage,pageNumber,orderType,search} = req.query;
    inquiryService
    .getinquirysByCategoryId(category_id,inquiryPerPage,pageNumber,orderType,search)
    .then(listinquiry => {
        res.status(200).json({status:200,message:"Success",data:listinquiry})
    })
    .catch(err=>{
        return res.status(500).json({status:200,message: err})
    })

})

inquiryApi.get('/get-by-customer-name/:name', (req,res,next) => {
    
   
    let {name} = req.params
    console.log(name);
    let {search} = req.query;
    inquiryService
    .getInquirysByCustomerName(name,search)
    .then(listinquiry => {
        res.status(200).json({status:200, message:"Success",data:listinquiry})
    })
    .catch(err=>{
        return res.status(500).json({status:200,message: err})
    })

})
inquiryApi.get('/:id',verifyToken,adminRole,(req,res,next)=>{
    let {id} = req.params
    inquiryService
    .getInquiryById(id)
    .then(inquiry=>{
        res.status(200).json({status:200,message:"Success",data:inquiry})
        })
    .catch(err=>{
        return res.status(500).json({status:200,message: err})
    })  
})
inquiryApi.post('/',checkRequiredFieldInBody(['phone','product_id']), (req,res,next)=>{
    
    let {customer_name,email,phone,message,product_name,product_id,product_link} = req.body
    console.log(product_link);
    inquiryService
    .createInquiry(customer_name,email,phone,message,product_name,product_id,product_link)
    .then(result => { 
        res.status(200).json({
            status:200,
            message: 'Post new inquiry successfully',
        })
    })
    .catch(err => {
        return res.status(500).json({status:200,message: err})
    })  
})

inquiryApi.delete('/:id',verifyToken,adminRole, (req,res,next)=>{
    let {id} = req.params
    inquiryService
    .deleteInquiry(id)
    .then(result=>{
        res.status(200).json({status:200,message:"Delete successfully"})
    })
    .catch(err=>{
        return res.status(500).json({status:200,message: err})
    })  
})



module.exports = inquiryApi;