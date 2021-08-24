'use strict'
const logger = require('../../logger/index')
const bcrypt = require('bcryptjs')
const { to } = require('../../helper/to')
const mysql = require('mysql')

class UserService {
    constructor(mysqlDb) {
        this.mysqlDb = mysqlDb
    }
    signUp(newUser) {
        return new Promise(async (resolve, reject) => {
            try {
                const query1 = `SELECT COUNT(*) AS numUser FROM user WHERE email = ${mysql.escape(newUser.email)}`
                let result1 = await this.mysqlDb.poolQuery(query1)
               
                const query2 = `SELECT COUNT(*) AS numUser FROM user WHERE username = ${mysql.escape(newUser.username)}`
                let result2 = await this.mysqlDb.poolQuery(query2)
        
                console.log(result1)
                if (result1[0].numUser > 0 && result2[0].numUser > 0) {
                    return reject(`Username and email is existed`)
                } else if (result1[0].numUser > 0) {
                    return reject(`Email is existed`)
                } else if (result2[0].numUser > 0) {
                    return reject(`Username is existed`)
                } else {
                    const query =
                        `INSERT INTO user(email,username, password)
                        VALUES (${mysql.escape(newUser.email)},${mysql.escape(newUser.username)},${mysql.escape(newUser.password)})
                    `
                    const [err, result] = await to(this.mysqlDb.poolQuery(query))
                    if (err) {
                        logger.error(err)
                        return reject(err)
                    }
                    return resolve(result)
                }
            } catch (err) {
                logger.error(`[userService][checkEmail] err: ${err}`)
                reject(err)
            }
        })
    }
 
    login(user) {
        return new Promise(async (resolve, reject) => {
            let query = `
                SELECT * FROM user 
                WHERE username = ${mysql.escape(user.username)} 
                OR email = ${mysql.escape(user.username)}
                LIMIT 1 
            `
            let [err, userFoundArray] = await to(this.mysqlDb.poolQuery(query))
            if (err) {
                logger.error(`[userService][login] err: ${err}`)
                return reject(err)
            }

            if (userFoundArray.length !== 0) {
                let userFound = userFoundArray[0]
                if (bcrypt.compareSync(user.password, userFound.password)) {
                    resolve(userFound)
                } else {
                    reject('Password is wrong')
                }
            } else {
                reject('Email or username wrong')
            }
        })
    }
    getUserInformation(req) {
        return new Promise(async (resolve,reject)=>{
            const userId = req.userId
            const query = `SELECT * FROM user WHERE id = ${mysql.escape(userId)}`;
            const [err,result] = await to(this.mysqlDb.poolQuery(query))
            const returnUser = {
                "id": result[0].id,
                "email": result[0].email,
                "username": result[0].username
              }
            if(err) {
                logger.error(`[userService][getUserInformation]`);
                return reject(err);
            }
            resolve(returnUser)
        }
        )
    }



}
module.exports = UserService