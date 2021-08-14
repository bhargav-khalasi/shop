const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/add-product'
  });
};

exports.getProducts = (req, res, next) => {
  req.user
    .getProducts()
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;

  if (!editMode) {
    return res.redirect('/');
  }

  const prodId = req.params.productId;

  req.user
    .getProducts({ where: { id: prodId } })
    .then(product => {
      if (!product[0]) {
        return res.redirect('/');
      }

      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/add-product',
        editing: editMode,
        product: product[0]
      });
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const { productId, title, imageUrl, description, price } = req.body;

  Product.findByPk(productId)
    .then(product => {
      (product.id = productId),
        (product.title = title),
        (product.imageUrl = imageUrl),
        (product.description = description),
        (product.price = price);

      return product.save();
    })
    .then(result => {
      console.log('updated product');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const { productId } = req.body;

  Product.destroy({
    where: {
      id: productId
    }
  })
    .then(result => {
      console.log('product deleted');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;

  req.user
    .createProduct({
      title,
      price,
      imageUrl,
      description
    })
    .then(result => {
      // console.log(result);
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    });
};
