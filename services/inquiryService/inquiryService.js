'use strict'
const mysql = require('mysql');
const logger = require('../../logger');
const {to} = require('../../helper/to');
const nodemailer = require("nodemailer");

const emailService = require("../sendEmailService/sendEmailService");

class InquiryService {
    constructor(mysqlDb) {
        this.mysqlDb = mysqlDb
    }

    getInquiries(itemsPerPage, pageNumber, orderType) {
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
                SELECT * FROM inquiry
                ORDER BY create_at ${mysql.escape(orderByDb).split(`'`)[1]}
                LIMIT ${itemsPerPage}
                OFFSET ${mysql.escape(offsetDb)}
            `
            console.log(query);
            let [err, inquiryResult] = await to(this.mysqlDb.poolQuery(query))
            if (err) {
                logger.error(`[inquiryService][getinquirys] errors: `, err)
                return reject(err?.sqlMessage ? err.sqlMessage : err)
            } else {
                return resolve(inquiryResult)
            }

        })
    }
    getInquiryById(id) {
        return new Promise(async (resolve, reject) => {
            const query = `
                SELECT * FROM inquiry WHERE id = ${mysql.escape(id)}
            `

            const [err, inquiryResult] = await to(this.mysqlDb.poolQuery(query))
            if (err) {
                logger.error(`[inquiryService][getinquiryById] errors: `, err)
                return reject(err?.sqlMessage ? err.sqlMessage : err)
            }
            if (!inquiryResult.length) {
                return reject(`inquiry with id ${id} not found`)
            }
            return resolve(inquiryResult[0])
        })
    }
    getInquirysByCustomerName(name,search) {
        return new Promise(async (resolve, reject) => {
            const query = `
                SELECT * FROM inquiry 
                WHERE customer_name LIKE ${mysql.escape('%'+name+'%')}
                OR customer_name LIKE ${mysql.escape('%'+search+'%')}
            `

            const [err, inquiryResult] = await to(this.mysqlDb.poolQuery(query))
            if (err) {
                logger.error(`[inquiryService][getinquiryByTitle] errors: `, err)
                return reject(err?.sqlMessage ? err.sqlMessage : err)
            }
            return resolve(inquiryResult)
        })
    }
    createInquiry(customer_name,email,phone,message,product_name,product_id,product_link,quantity) {
        return new Promise(async (resolve, reject) => {
            const query = `
                INSERT INTO inquiry(customer_name,email,phone,message,product_name,product_id,product_link)
                VALUES(${mysql.escape(customer_name)},${mysql.escape(email)},${mysql.escape(phone)},${mysql.escape(message)},${mysql.escape(product_name)},${mysql.escape(product_id)},${mysql.escape(product_link)})
            `
            console.log(query)
            const [err, result] = await to(this.mysqlDb.poolQuery(query))
            if (err) {
                console.log(err);
                logger.error(`[inquiryService][createinquiry] errors: `, err)
                return reject(err?.sqlMessage ? err.sqlMessage : err)
            }
            try{
            const payload = {
                customer_name : customer_name ? customer_name : "No Information",
                email: email ? email : "No information",
                phone: phone,
                message: message ? message : "",
                product_name: product_name ? product_name : "No information",
                product_id: product_id ? product_id : -1,
                product_link: product_link ? product_link : "No information",
            }
            await emailService.sendEmail(payload);
            if(err) {
                reject(err);
            }
            }catch(err){
                console.log(`Send mail failure: ${err}`);
                reject(`${err}`)

            }
            return resolve(result?.insertId)
        })
    }

    deleteInquiry(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const query = `
                    DELETE FROM inquiry
                    WHERE id = ${mysql.escape(id)}
                `
                let result = await this.mysqlDb.poolQuery(query)
                if (result.affectedRows === 0) {
                    return reject(`inquiry with id ${id} not found`)
                }

                return resolve(`Delete Inquiry with ${id} Successfully`)
            } catch (err) {
                logger.error(`[InquiryService][deleteinquiry] errors: `, err)
                return reject(err?.sqlMessage ? err.sqlMessage : err)
            }
        })
    }

}


module.exports = InquiryService