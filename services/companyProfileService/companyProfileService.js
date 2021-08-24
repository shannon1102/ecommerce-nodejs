'use strict'
const mysql = require('mysql');
const logger = require('../../logger');
const { to } = require('../../helper/to');
class CompanyProfileService {
    constructor(mysqlDb) {
        this.mysqlDb = mysqlDb
    }

    getAllCompanyProfile() {
        return new Promise(async (resolve, reject) => {
        
            const query = `
                SELECT * FROM company_profile
                ORDER BY create_at DESC
            `
            console.log(query);
            let [err, result] = await to(this.mysqlDb.poolQuery(query))
            if (err) {
                logger.error(`[CompanyProfileService][getCompanyProfile] errors: `, err)
                return reject(err?.sqlMessage ? err.sqlMessage : err)
            } else {
                return resolve(result)
            }

        })
    }
    getCompanyProfileById(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const query = `
                SELECT * FROM company_profile WHERE id = ${mysql.escape(id)}
                `
                console.log(query);
                const [err, companyProfile] = await to(this.mysqlDb.poolQuery(query))
                if (err) {
                    logger.error(`[CompanyProfileService][getCompanyProfileById] errors: `, err)
                    return reject(err?.sqlMessage ? err.sqlMessage : err)
                }
                if (!companyProfile.length) {
                    return reject(`company_profile with id ${id} not found`)
                }
                return resolve(companyProfile[0])
            } catch (error) {
                return reject(`Error : ${error}`)
            }

        })
    }
    createCompanyProfile(name,address, basic_information,phone,zalo, url_image) {
        console.log("Post")
        return new Promise(async (resolve, reject) => {
          
            const query = `
                INSERT INTO company_profile (name,address, basic_information,phone,zalo, url_image)
                VALUES (${mysql.escape(name)},${mysql.escape(address)},${mysql.escape(basic_information)},${mysql.escape(phone)},${mysql.escape(zalo)},${mysql.escape(url_image)})`

            const [err, result] = await to(this.mysqlDb.poolQuery(query))
            if (err) {
                console.log(err);
                logger.error(`[CompanyProfileService][createCompanyProfile] errors: `, err)
                return reject(err?.sqlMessage ? err.sqlMessage : err)
            }
            return resolve(result?.insertId)
        })
    }

    updateCompanyProfile(id, name,address, basic_information,phone,zalo, url_image) {
        return new Promise(async (resolve, reject) => {
            const query = `
                UPDATE company_profile SET 
                name = ${mysql.escape(name)},
                address = ${mysql.escape(address)},
                basic_information = ${mysql.escape(basic_information)},
                phone = ${mysql.escape(phone)},
                zalo = ${mysql.escape(zalo)},
                url_image = ${mysql.escape(url_image)}
                WHERE id = ${mysql.escape(id)}
            `
            const [err, result] = await to(this.mysqlDb.poolQuery(query))
            if (err) {
                logger.error(`[CompanyProfileService][updateMaicompany_profile] errors: `, err)
                return reject(err?.sqlMessage ? err.sqlMessage : err)
            }
            if (result.affectedRows === 0) {
                return reject(`CompanyProfile with id ${id} not found`)
            }

            return resolve(result)
        })
    }
    deleteCompanyProfile(id) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.mysqlDb.beginTransaction()
                const query =
                    `
                    DELETE  FROM company_profile
                    WHERE id = ${mysql.escape(id)}
                `
                let result = await this.mysqlDb.poolQuery(query)
                if (result.affectedRows === 0) {
                    return reject(` Company_profile with id ${id} not found`)
                }
                await this.mysqlDb.commit()
                return resolve(`message: Remove successfully`);
            } catch (err) {
                logger.error(`[company_profileService][deleteCompany_profile] errors: `, err)
                await this.mysqlDb.rollback()
                return reject(err?.sqlMessage ? err.sqlMessage : err)
            }
        })
    }

}


module.exports = CompanyProfileService