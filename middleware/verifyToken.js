'use strict'
const jwt = require('jsonwebtoken')

const logger = require('../logger/index')
const mysql = require('mysql');
const MysqlDB = require('../models/mysql')
const mysqlDb = new MysqlDB()
const  {to} = require('../helper/to')

const verifyToken = (req,res,next) => {

    const token = req.headers['authorization']?.split(' ')[1] || req.headers['x-access-token'] || null
    
    if(!token) {
        logger.error('Token is missing');
        return res.status(401).json({
            message: 'Token is required'
        })
    }
    jwt.verify(token,process.env.SECRET_KEY,(err,decoded) => {
        if(err) {
            logger.error(`Failed to authenticate token: ${err}`);
            return res.status(401).json({message: 'Failed to authenticate token'})  
        }
        req.userId  = decoded.id
        // req.token = token
        next()
    })
}

const adminRole = async (req,res,next)=>{

    if(!req.userId) {
        logger.error('Token is missing');
        return res.status(401).json({
            message: 'Token is required,you need to login'
        })
    }
    const query = `SELECT * from user WHERE id =${mysql.escape(req.userId)}`

    const [err,result] = await to(mysqlDb.poolQuery(query))
    const userFound = result[0]
    if(userFound.role ===  1) {
        next()
    } else{
        logger.error(`Bad request.You don't have permission`);
        return res.status(401).json({message: 'You dont have this permission'}) 
    }


}

module.exports = Object.assign({},{verifyToken,adminRole});