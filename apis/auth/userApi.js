'use strict'
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { verifyToken,adminRole } = require('../../middleware/verifyToken')

const { checkRequiredFieldInBody,checkRequiredFieldInQuery } = require('../../middleware/index')
const userApi = express.Router()
const MysqlDB = require('../../models/mysql')
const mysqlDb = new MysqlDB()
const UserService = require('../../services/userService/userService')
const userService = new UserService(mysqlDb)


userApi.post('/signup', checkRequiredFieldInBody(['username', 'email', 'password']), async (req, res, next) => {
    
    console.log("Vao signup");
    if (!process.env.SECRET_KEY) {
        return res.status(500).json({
            message: 'Secrete key is missing'
        });
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 8)
   
    console.log(req.body);  
    const newUser = {
        email: req.body.email,
        username: req.body.username,
        password: hashedPassword
    }
    userService
        .signUp(newUser)
        .then(result => {
            if (result.affectedRows === 1) {
                const accessToken = jwt.sign(
                    {
                        id: result.insertId
                    },
                    process.env.SECRET_KEY,
                    {
                        expiresIn: 86400
                    }
                )
                return res.status(200).json({
                    message: 'User is created successfully',
                    username: newUser.username,
                    'access-token': accessToken
                })


            } else {
                return res.status(500).json({
                    message: 'User is not created successfully'
                })
            }
        })
        .catch(errMsg => {
            return res.status(501).json({
                message: `server error , ${errMsg}`
            })
        })
})

userApi.post('/login',checkRequiredFieldInBody(['username','password']), (req, res, next) => {
    // check secret token for jwt
    if (!process.env.SECRET_KEY){
        return res.status(500).json({message:'Secret key not found, cannot login'})
    }
    const userCredential = {
        username: req.body.username,
        password: req.body.password
    }

    userService
        .login(userCredential)
        .then(user => {
            const accessToken = jwt.sign(
                {
                    id: user.id
                },
                process.env.SECRET_KEY,
                {
                    expiresIn: 86400
                }
            )
            res.status(200).json({
                message: 'Login successfully',
                username: user.username,
                'access-token': accessToken
            })
        })
        .catch(errMsg => {
            return res.status(500).json({
                message: errMsg
            })
        })
})
userApi.get('/information', verifyToken, (req, res, next) => {
    userService
        .getUserInformation(req)
        .then(user => {
            return res.status(200).json(user)})
        .catch(errMsg => {
        return res.status(500).json({
            message: errMsg
        })
    })
})

module.exports = userApi