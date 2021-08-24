'use strict'

const express = require('express')
const MysqlDB = require('../../models/mysql')
const {checkRequiredFieldInBody} = require('../../middleware')
const CompanyProfileService = require('../../services/companyProfileService/companyProfileService')
const companyProfileApi = express.Router()
const mysqlDb = new MysqlDB()
const companyProfileService = new CompanyProfileService(mysqlDb)
const { verifyToken,adminRole } = require('../../middleware/verifyToken')


companyProfileApi.get('/', async (req, res, next) => {
    try {
        const result = await companyProfileService.getAllCompanyProfile()

        return res.status(200).json({status:200,message:"Success",data:result})
    } catch (error) {
        return res.status(500).json({status:500,message: error})
    }
})

companyProfileApi.get('/:id', async (req, res, next) => {
    try {
        let {id} = req.params
        const companyProfile = await companyProfileService.getCompanyProfileById(id)

        return res.status(200).json({status:200,message:"Success",data: companyProfile})
    } catch (error) {   
        return res.status(500).json({status:500,message: error})
    }
})

companyProfileApi.post('/',verifyToken,adminRole,
    checkRequiredFieldInBody(['name','basic_information','phone']),
    async (req, res, next) => {
        try {
           
            let {name,address, basic_information,phone,zalo, url_image} = req.body
            const insertedId = await companyProfileService.createCompanyProfile(name,address, basic_information,phone,zalo,url_image)
            return res.status(200).json({status:200,message: 'Create new comppany_profile successfully'})
        } catch (error) {
            return res.status(500).json({status:500,message: error})
        }
    })
companyProfileApi.put('/:id',verifyToken,adminRole,
    checkRequiredFieldInBody(['name','basic_information','phone']),
    async (req, res, next) => {
        let {id} = req.params
        try {
            let { name,address, basic_information,phone,zalo, url_image} = req.body
            await companyProfileService.updateCompanyProfile(id, name,address, basic_information,phone,zalo, url_image)
            return res.status(200).json({status: 200,message: 'Updated main-category successfully'})
        } catch (error) {
            return res.status(500).json({status:500,message: error})
        }
    })

companyProfileApi.delete('/:id',verifyToken,adminRole,
    async (req, res, next) => {
        let {id} = req.params   
        try {
            await companyProfileService.deleteCompanyProfile(id)

            return res.status(200).json({status:200,message: `Remove company-profile with id ${id} successfully`})
        } catch (error) {
            return res.status(500).json({status:500,message: error})
        }
    })

module.exports = companyProfileApi