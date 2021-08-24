'use strict'
const multer = require('multer');
const path =require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    //   cb(null, path.join(__dirname,'/tmp/uploads'))
    cb(null, 'public/image/')
    },
    filename: function (req, file, cb) {
      const typeTag = file.mimetype.split('/')[1]
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix + '.' + typeTag)
    }
  })
  
const upload = multer({ storage: storage })
module.exports = upload;