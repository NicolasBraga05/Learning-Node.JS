const Product = require('../models/Product')

module.exports = class ProductController {
    static showProducts(req, res) {
        res.render('products/all')
    }
}