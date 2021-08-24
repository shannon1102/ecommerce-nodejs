'use strict'

const express = require('express')
const MysqlDB = require('../../models/mysql')
const { checkRequiredFieldInBody } = require('../../middleware')
const TagService = require('../../services/tagService/tagService')
const { verifyToken, adminRole } = require('../../middleware/verifyToken')
const tagApi = express.Router()
const mysqlDb = new MysqlDB()
const tagService = new TagService(mysqlDb)

tagApi.get('/', async (req, res, next) => {
    try {
        let { tagsPerPage, pageNumber, orderType } = req.query
        const tagFounded = await tagService.getAllTag(tagsPerPage, pageNumber, orderType)
        console.log(tagFounded);
        return res.status(200).json({
            status: 200,
            message: "Success",
            data: tagFounded
        })
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error
        })
    }
})

tagApi.get('/:id', async (req, res, next) => {
    try {
        let { id } = req.params
        const tagFounded = await tagService.getTagById(id)

        return res.status(200).json({
            status: 200,
            message: "Success",
            data: tagFounded
        })
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error
        })
    }
})
tagApi.get('/get-by-slug/:slug', async (req, res, next) => {
    try {
        let { slug } = req.params
        const tagFounded = await tagService.getTagBySlug(slug)

        return res.status(200).json({
            status: 200,
            message: "Success",
            data: tagFounded
        })
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error
        })
    }
})

tagApi.post('/', verifyToken, adminRole,
    checkRequiredFieldInBody(['name']),
    async (req, res, next) => {
        try {
            let { name } = req.body
            const insertedId = await tagService.createTag(name)

            return res.status(200).json({ status: 200, message: 'Create new main-tag successfully' })
        } catch (error) {
            return res.status(500).json({ status: 500, message: error })
        }
    })
tagApi.put('/:id', verifyToken, adminRole,
    checkRequiredFieldInBody(['name']),
    async (req, res, next) => {
        let { id } = req.params
        try {
            let { name } = req.body
            await tagService.updateTag(id, name)
            return res.status(200).json({ status: 200, message: 'Updated main-tag successfully' })
        } catch (error) {
            return res.status(500).json({ status: 500, message: error })
        }
    })

tagApi.delete('/:id', verifyToken, adminRole,
    async (req, res, next) => {
        let { id } = req.params
        try {
            await tagService.deleteTag(id)

            return res.status(200).json({
                status: 200,
                message: 'Remove tag successfully'
            })
        } catch (error) {
            return res.status(500).json({ status: 500, message: error })
        }
    })

module.exports = tagApi