'use strict'
const mysql = require('mysql');
const { orderTypeSetting } = require('../../config/index');
const logger = require('../../logger');
const { to } = require('../../helper/to');

class HotProductService {
    constructor(mysqlDb) {
        this.mysqlDb = mysqlDb
    }
    getHotProducts(productsPerPage, pageNumber, orderType, search) {
        return new Promise(
            async (resolve, reject) => {
                let offsetDb = 0, orderByDb;
                orderType = orderType ? orderType : 2
                pageNumber = pageNumber ? pageNumber : 1
                productsPerPage = productsPerPage ? productsPerPage : 100
                offsetDb = productsPerPage * (pageNumber - 1)
                search = search ? search : ""
                if (orderType == orderTypeSetting.ASC) {
                    orderByDb = 'ASC'
                } else {
                    orderByDb = 'DESC'
                }
                const query =
                    `SELECT p.*,pi.url_image1,pi.url_image2,pi.url_image3,pi.url_image4
                    FROM product as p  
                    JOIN hot_product as hp ON p.id = hp.product_id 
                    JOIN product_image as pi ON pi.product_id = p.id
                    WHERE 
                    (p.name LIKE ${mysql.escape('%' + search + '%')}
                    OR p.description LIKE ${mysql.escape('%' + search + '%')})
                    ORDER BY hp.create_at ${mysql.escape(orderByDb).split(`'`)[1]}
                    LIMIT ${productsPerPage}
                    OFFSET ${mysql.escape(offsetDb)}`
                console.log(query)
                let [err, listProduct] = await to(this.mysqlDb.poolQuery(query))
                if (err) {
                    logger.error(`[hotProductService][getHotProducts] errors : `, err)
                    return reject(err)
                } else {
                    return resolve(this.returnListProduct(listProduct))
                }

            });
    }

    setHotProduct(product_id) {
        return new Promise(async (resolve, reject) => {
            try {
               
                const getQuery = `SELECT * FROM hot_product 
              WHERE product_id = ${mysql.escape(product_id)}`

                const [err1, result1] = await to(this.mysqlDb.poolQuery(getQuery))
                if (result1.length != 0) {

                    return reject({ message: `hot-product existed` })
                }

                const query = `INSERT INTO hot_product(product_id) 
                VALUES (${mysql.escape(product_id)})`
                console.log(query);
                console.log("????????")
                const [err2, result] = await to(this.mysqlDb.poolQuery(query))
                if (err2) {
                    logger.error(`[hotProductService][createHotProduct] errors: `, err)
                    return reject(err)
                }
                return resolve(result)
            } catch (err) {
                return reject(err)
            }


        })
    }

    unSetHotProduct(product_id) {
        return new Promise(async (resolve, reject) => {
            let query = ``
            try {
                await this.mysqlDb.beginTransaction()
                query = `
                DELETE FROM hot_product
                WHERE product_id = ${mysql.escape(product_id)}
                `
                let result = await this.mysqlDb.poolQuery(query)

                if (result.affectedRows === 0) {
                    return reject(`Delete product with id ${product_id} not sucessfully`)
                }
                await this.mysqlDb.commit()
                return resolve(`Remove hot-product with id ${product_id} sucessfully`)
            } catch (err) {
                logger.error(`[hotProductService][deleteHotProduct] errors: `, err)
                await this.mysqlDb.rollback()
                return reject(err.sqlMessage)
            }
        })
    }
    returnListProduct = (listProduct) => {
        return listProduct.map(e => {
            return {
                "id": e.id,
                "name": e.name,
                "description": e.description,
                "price": e.price,
                "discount": e.discount,
                "new_price": e.price - e.price * (e.discount / 100),
                "category_id": e.category_id,
                "slug": e.slug,
                "create_at": e.create_at,
                "update_at": e.update_at,
                "list_product_images": [e.url_image1, e.url_image2, e.url_image3, e.url_image4].filter(e1 => (e1 !== null && e1?.length > 0))
            }
        })
    }
}

module.exports = HotProductService;