'use strict'
const mysql = require('mysql');
const logger = require('../../logger');
const { to } = require('../../helper/to');
const {createSlug} = require('../../utils/index')
class TagService {
    constructor(mysqlDb) {
        this.mysqlDb = mysqlDb
    }

    getAllTag(itemsPerPage, pageNumber, orderType) {
        return new Promise(async (resolve, reject) => {
            let offsetDb, orderByDb
            orderType = orderType ? orderType : 'newest'
            pageNumber = pageNumber ? pageNumber : 1
            if (!itemsPerPage) {
                itemsPerPage = 100
                offsetDb = 0
            } else {
                offsetDb = itemsPerPage * (pageNumber - 1)
            }
            if (orderType === 'oldest') {
                orderByDb = 'ASC'
            } else {
                orderByDb = 'DESC'
            }
            const query = `
                SELECT * FROM tag
                ORDER BY create_at ${mysql.escape(orderByDb).split(`'`)[1]}
                LIMIT ${itemsPerPage}
                OFFSET ${mysql.escape(offsetDb)}
            `
            console.log(query);
            let [err, result] = await to(this.mysqlDb.poolQuery(query))
            if (err) {
                logger.error(`[tagService][getAllTag] errors: `, err)
                return reject(err?.sqlMessage ? err.sqlMessage : err)
            } else {
                return resolve(result)
            }

        })
    }
    getTagById(id) {
        return new Promise(async (resolve, reject) => {
            try {  
                const query2 = `
                SELECT * from tag
                WHERE id = ${mysql.escape(id)}
                `
                const [err, tagResult] = await to(this.mysqlDb.poolQuery(query2))
                if (err) {
                    logger.error(`[tagService][gettagById] errors: `, err)
                    return reject(err?.sqlMessage ? err.sqlMessage : err)
                }
                if (!tagResult.length) {
                    return reject(`tag with id ${id} not found`)
                }
                return resolve(tagResult[0])

            } catch (error) {
                console.log(error);
                reject(error)
            }

        })
    }
    getTagBySlug(slug) {
        return new Promise(async (resolve, reject) => {
            try {  
                const query2 = `
                SELECT * from tag
                WHERE tag.slug = ${mysql.escape(slug)}
                `
                const [err, tagResult] = await to(this.mysqlDb.poolQuery(query2))
                if (err) {
                    logger.error(`[tagService][gettagById] errors: `, err)
                    return reject(err?.sqlMessage ? err.sqlMessage : err)
                }
                if (!tagResult.length) {
                    return reject(`tag with id ${id} not found`)
                }
                return resolve(tagResult[0])

            } catch (error) {
                console.log(error);
                reject(error)
            }

        })
    }
    createTag(name) {
        return new Promise(async (resolve, reject) => {
            console.log(name);
            const slug = createSlug(name);
            const query = `
                INSERT INTO tag(name,slug)
                VALUES(${mysql.escape(name)},${mysql.escape(slug)})`

            const [err, result] = await to(this.mysqlDb.poolQuery(query))
            if (err) {
                console.log(err);
                logger.error(`[tagService][createtag] errors: `, err)
                return reject(err?.sqlMessage ? err.sqlMessage : err)
            }
            return resolve(result?.insertId)
        })
    }
    updateTag(id, name) {
        return new Promise(async (resolve, reject) => {
            const newSlug = createSlug(name);
            const query = `
                UPDATE tag SET 
                name = ${mysql.escape(name)},
                slug = ${mysql.escape(newSlug)}
                WHERE id = ${mysql.escape(id)}
            `
            const [err, result] = await to(this.mysqlDb.poolQuery(query))
            if (err) {
                logger.error(`[tagService][updatetag] errors: `, err)
                return reject(err?.sqlMessage ? err.sqlMessage : err)
            }
            if (result.affectedRows === 0) {
                return reject(`tag with id ${id} not found`)
            }

            return resolve(result)
        })
    }
    deleteTag(id) {
        return new Promise(async (resolve, reject) => {
            try {
            
                const query = `
                    DELETE FROM tag
                    WHERE id = ${mysql.escape(id)}
                `
                let result = await to(this.mysqlDb.poolQuery(query))
             
                if (result.affectedRows === 0) {
                    return reject(`tag with id ${id} not found`)
                }
        
                return resolve(`delete successfully`);
            } catch (err) {
                logger.error(`[tagService][deleteTag] errors: `, err)
               
                return reject(err?.sqlMessage ? err.sqlMessage : err)
            }
          
        })
    }

}


module.exports = TagService