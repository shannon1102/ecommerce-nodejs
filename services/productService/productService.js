'use strict'
const mysql = require('mysql');
const { orderTypeSetting } = require('../../config/index');
const logger = require('../../logger');
const { to } = require('../../helper/to');
const { createSlug } = require('../../utils/index')

class ProductService {
    constructor(mysqlDb) {
        this.mysqlDb = mysqlDb
    }
    getProducts(minPrice, maxPrice, productsPerPage, pageNumber, orderType, search) {
        return new Promise(
            async (resolve, reject) => {
                let offsetDb = 0, orderByDb;
                orderType = orderType ? orderType : 2
                pageNumber = pageNumber ? pageNumber : 1
                productsPerPage = productsPerPage ? productsPerPage : 100
                offsetDb = productsPerPage * (pageNumber - 1)
                minPrice = minPrice ? minPrice : 0
                maxPrice = maxPrice ? maxPrice : 10000000000000
                // search = search ? search : ""
                if (search) {
                    var stringSearch = search.split(' ').map(element => {
                        return `p.name LIKE ${mysql.escape('%' + element + '%')} OR p.description LIKE ${mysql.escape('%' + element + '%')}`
                    }).join(' OR ')
                    console.log(stringSearch);
                } else {
                    stringSearch = `p.name LIKE ${mysql.escape('%' + "" + '%')} OR p.description LIKE ${mysql.escape('%' + "" + '%')}`
                }
                if (orderType == orderTypeSetting.ASC) {
                    orderByDb = 'ASC'
                } else {
                    orderByDb = 'DESC'
                }

                const query =
                    `SELECT p.*,pi.url_image1,pi.url_image2,pi.url_image3,pi.url_image4 
                    FROM product as p
                    JOIN product_image AS pi ON p.id = pi.product_id
                    WHERE 
                    ((p.price*(100-p.discount)/100) >= ${minPrice}
                    AND (p.price*(100-p.discount)/100) <= ${maxPrice})
                    AND (${stringSearch})          
                    ORDER BY p.create_at ${mysql.escape(orderByDb).split(`'`)[1]}
                    LIMIT ${productsPerPage}
                    OFFSET ${mysql.escape(offsetDb)}`
                console.log(query)
                let [err, listProduct] = await to(this.mysqlDb.poolQuery(query))
                console.log(listProduct)
                let listProductReturn = this.returnListProduct(listProduct)
                if (err) {
                    logger.error(`[productService][getProducts] errors : `, err)
                    return reject(err)
                } else {
                    return resolve(listProductReturn)
                }

            });
    }

    getProductsByCategoryId(category_id, productsPerPage, pageNumber, orderType, search) {
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
                    `SELECT p.*,pi.url_image1,pi.url_image2,pi.url_image3,pi.url_image4 FROM product as p
                    JOIN product_image AS pi ON pi.product_id= p.id
            WHERE p.category_id = ${mysql.escape(category_id)}
            AND ( p.name LIKE ${mysql.escape('%' + search + '%')}
            OR p.description LIKE ${mysql.escape('%' + search + '%')})
            ORDER BY p.create_at ${mysql.escape(orderByDb).split(`'`)[1]}
            LIMIT ${productsPerPage}
            OFFSET ${mysql.escape(offsetDb)}`

                let [err, listProduct] = await to(this.mysqlDb.poolQuery(query))
                if (err) {
                    logger.error(`[productService][getProducts] errors : `, err)
                    return reject(err)
                } else {
                    return resolve(this.returnListProduct(listProduct))
                }

            });

    }
    // getProductsByCategoryName(main_category, category, productsPerPage, pageNumber, orderType, search) {
    //     return new Promise(
    //         async (resolve, reject) => {
    //             let offsetDb = 0, orderByDb;
    //             orderType = orderType ? orderType : 2
    //             pageNumber = pageNumber ? pageNumber : 1
    //             productsPerPage = productsPerPage ? productsPerPage : 10
    //             offsetDb = productsPerPage * (pageNumber - 1)
    //             search = search ? search : ""
    //             if (orderType == orderTypeSetting.ASC) {
    //                 orderByDb = 'ASC'
    //             } else {
    //                 orderByDb = 'DESC'
    //             }
    //             const query =
    //                 `SELECT p.* FROM product as p
    //         JOIN category ON p.category_id = category.id 
    //         JOIN main_category ON main_category.id = category.main_category_id 
    //         WHERE  main_category.name = ${mysql.escape(main_category)}
    //         AND category.name = ${mysql.escape(category)}
    //         AND (p.name LIKE ${mysql.escape('%' + search + '%')}
    //         OR p.description LIKE ${mysql.escape('%' + search + '%')})
    //         ORDER BY p.create_at ${mysql.escape(orderByDb).split(`'`)[1]}
    //         LIMIT ${productsPerPage}
    //         OFFSET ${mysql.escape(offsetDb)}`
    //             console.log(query)
    //             let [err, listProduct] = await to(this.mysqlDb.poolQuery(query))
    //             if (err) {
    //                 logger.error(`[productService][getProducts] errors : `, err)
    //                 return reject(err)
    //             } else {
    //                 return resolve(listProduct)
    //             }

    //         });

    // }
    getProductById(id) {

        return new Promise(async (resolve, reject) => {

            const query1 =
                `SELECT p.*,c.slug AS category_slug,pi.url_image1,pi.url_image2,pi.url_image3,pi.url_image4
                FROM product AS p
                JOIN product_image AS pi ON pi.product_id = p.id
                JOIN category AS c ON c.id = p.category_id
            WHERE p.id = ${mysql.escape(id)}`
         
            const [err1, productResult] = await to(this.mysqlDb.poolQuery(query1))
            console.log(productResult);
            if (err1) {
                logger.error(`[productService][getProductById] errors: `, err)
                return reject(err)
            }
            if (!productResult.length) {
                return reject(`product with id ${id} not found`)
            }

            return resolve(this.returnProduct(productResult[0]))
        })
    }
    getProductsByCategorySlug(category_slug, productsPerPage, pageNumber, orderType, search) {
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
                    `SELECT p.*,c.slug AS category_slug,pi.url_image1,pi.url_image2,pi.url_image3,pi.url_image4 FROM product as p
                    JOIN category AS c ON p.category_id = c.id
                    JOIN product_image AS pi ON pi.product_id= p.id

            WHERE c.slug = ${mysql.escape(category_slug)}
            AND ( p.name LIKE ${mysql.escape('%' + search + '%')}
            OR p.description LIKE ${mysql.escape('%' + search + '%')})
            ORDER BY p.create_at ${mysql.escape(orderByDb).split(`'`)[1]}
            LIMIT ${productsPerPage}
            OFFSET ${mysql.escape(offsetDb)}`
                console.log(query)

                let [err, listProduct] = await to(this.mysqlDb.poolQuery(query))
                if (err) {
                    logger.error(`[productService][getProducts] errors : `, err)
                    return reject(err)
                } else {
                    return resolve(this.returnListProduct(listProduct))
                }

            });

    }
    getProductBySlug(slug) {

        return new Promise(async (resolve, reject) => {
            try {
                const query1 =
                    `SELECT p.*,c.slug AS category_slug,pi.url_image1,pi.url_image2,pi.url_image3,pi.url_image4
                    FROM product AS p
                    JOIN product_image AS pi ON pi.product_id = p.id
                    JOIN category AS c ON c.id = p.category_id
                    WHERE p.slug = ${mysql.escape(slug)}`

                console.log(query1)
                const [err1, productResult] = await to(this.mysqlDb.poolQuery(query1))
                console.log(productResult);

                if (err1) {
                    logger.error(`[productService][getProductById] errors: `, err)
                    return reject(err1)
                }
                if (!productResult.length) {
                    return reject(`product with id ${id} not found`)
                }
                console.log(productResult[0]);
                return resolve(this.returnProduct(productResult[0]));

            } catch (error) {
                logger.error(error);
                return reject(error)

            }

        })
    }
    createProduct(name, description, detail, list_product_images, price, discount, category_id) {
        console.log(list_product_images)
        const slug = createSlug(name);
        const url_image1 = list_product_images[0] ? list_product_images[0] : null;
        const url_image2 = list_product_images[1] ? list_product_images[1] : null;
        const url_image3 = list_product_images[2] ? list_product_images[2] : null;
        const url_image4 = list_product_images[3] ? list_product_images[3] : null;
        return new Promise(async (resolve, reject) => {
            try {
                await this.mysqlDb.beginTransaction()
                const query = `INSERT INTO product(name,description,detail,price, discount,category_id,slug) 
            VALUES (${mysql.escape(name)},${mysql.escape(description)},${mysql.escape(detail)},${mysql.escape(price)},${mysql.escape(discount)},${mysql.escape(category_id)},${mysql.escape(slug)})
            `
                const [err0, result] = await to(this.mysqlDb.poolQuery(query))
                if (err0) {
                    logger.error(`[productService][createProduct] errors: `, err0)
                    return reject(err0)
                }
                console.log(result);
                const insertId = result.insertId;

                const query2 = `INSERT INTO product_image (product_id,url_image1,url_image2,url_image3,url_image4) 
            VALUES (${mysql.escape(insertId)},${mysql.escape(url_image1)},${mysql.escape(url_image2)},${mysql.escape(url_image3)},${mysql.escape(url_image4)})`
                const [err2, result2] = await to(this.mysqlDb.poolQuery(query2))
                console.log(query2)
                if (err2) {
                    logger.error(`[productService][createProduct] errors: `, err2)
                    return reject(err2)
                }
                await this.mysqlDb.commit()
                return resolve()

            } catch (error) {
                logger.error(`[productService][createProduct] errors: `, error)
                await this.mysqlDb.rollback()
                return reject(error.sqlMessage)
            }


        })
    }
    updateProduct(id, name, description, detail, list_product_images, price, discount, category_id) {

        return new Promise(async (resolve, reject) => {
            try {
                const newSlug = createSlug(name);
                const url_image1 = list_product_images[0] ? list_product_images[0] : null;
                const url_image2 = list_product_images[1] ? list_product_images[1] : null;
                const url_image3 = list_product_images[2] ? list_product_images[2] : null;
                const url_image4 = list_product_images[3] ? list_product_images[3] : null;

                await this.mysqlDb.beginTransaction()
                const query = `UPDATE product
               SET name = ${mysql.escape(name)},
               description = ${mysql.escape(description)},
               detail = ${mysql.escape(detail)},
               price = ${mysql.escape(price)},
               discount = ${mysql.escape(discount)},
               category_id = ${mysql.escape(category_id)},
               slug = ${mysql.escape(newSlug)}
               WHERE id = ${mysql.escape(id)}
               `
                const [err, result] = await to(this.mysqlDb.poolQuery(query))
                if (err) {
                    logger.error(`[productService][updateProduct] errors: `, err)
                    return reject(err)
                }
                const query1 = `UPDATE product_image
                SET url_image1 = ${mysql.escape(url_image1)},
                url_image2 = ${mysql.escape(url_image2)},
                url_image3 = ${mysql.escape(url_image3)},
                url_image4 = ${mysql.escape(url_image4)}
                WHERE product_id = ${mysql.escape(id)}
            `
                const [err1, result1] = await to(this.mysqlDb.poolQuery(query1))
                if (err1) {
                    logger.error(`[productService][updateProductImage] errors: `, err1)
                    return reject(err1)
                }
                await this.mysqlDb.commit()
                return resolve()

            } catch (error) {
                logger.error(`[productService][createProduct] errors: `, error)
                await this.mysqlDb.rollback()
                return reject(error.sqlMessage)
            }
        })

    }
    deleteProduct(id) {
        return new Promise(async (resolve, reject) => {
            let query = ``
            try {
                await this.mysqlDb.beginTransaction()
                query = `SELECT COUNT(*) AS numProduct FROM product WHERE id = ${mysql.escape(id)}`
                let result1 = await this.mysqlDb.poolQuery(query)
                if (!result1[0].numProduct) {
                    return reject(`Product with id ${id} not found`)
                }
                query = `
                DELETE FROM product
                WHERE id = ${mysql.escape(id)}
                `
                let result3 = await this.mysqlDb.poolQuery(query)

                if (result3.affectedRows === 0) {
                    return reject(`Delete product with id ${id} not sucessfully`)
                }
                await this.mysqlDb.commit()
                return resolve(`Delete product with id ${id} sucessfully`)
            } catch (err) {
                logger.error(`[productService][deleteProduct] errors: `, err)
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
                "detail": e.detail,
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
    returnProduct = (e) => {
        console.log("???")
        return {
            "id": e.id,
            "name": e.name,
            "description": e.description,
            "detail":e.detail,
            "price": e.price,
            "discount": e.discount,
            "new_price": e.price - e.price * (e.discount / 100),
            "category_id": e.category_id,
            "slug": e.slug,
            "create_at": e.create_at,
            "update_at": e.update_at,
            "list_product_images": [e.url_image1, e.url_image2, e.url_image3, e.url_image4].filter(e1 => (e1 !== null && e1?.length > 0))
        }
    }
}

module.exports = ProductService;