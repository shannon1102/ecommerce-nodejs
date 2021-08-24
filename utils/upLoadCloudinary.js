let cloudinary = require("cloudinary").v2;
let streamifier = require('streamifier');
let {unlink} = require('fs')
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
})

let upLoadCloudinary = (filename) => {

  return new Promise((resolve, reject) => {

    cloudinary.uploader.upload(filename,{folder: 'post'}, function (error, result) {
      
      // console.log(result, error)
      if (result) {
        unlink(filename, (err) => {
          if (err) throw err;
          console.log('path/file.txt was deleted');
        });
        console.log(result)
        resolve(result);  
     
      } else {
        reject(error);
      }
    }
    );
  });

};
let deleteImageCloudinary = (public_url) => {
  return new Promise((resolve, reject) => {

    cloudinary.uploader.destroy(public_url, function (error, result) {
      
      // console.log(result, error)
      if (err) {
        reject(error);
       
      } else {
        resolve(`Delete succesfully`,result);
      }
    });
  });

}
module.exports = Object.assign({}, { upLoadCloudinary,deleteImageCloudinary })