// // module.exports = router;
// const router = require('express').Router();
// const { Product, Category, Tag, ProductTag } = require('../../models');

// // Middleware for handling errors
// function errorHandler(err, req, res, next) {
//   console.error('Error:', err);
//   res.status(500).json({ error: 'Internal Server Error' });
// }

// // get all products
// router.get('/', async (req, res, next) => {
//   try {
//     const products = await Product.findAll({
//       include: [
//         { model: Category },
//         { model: Tag, through: ProductTag },
//       ],
//     });
//     res.json(products);
//   } catch (err) {
//     next(err); // Pass the error to the errorHandler middleware
//   }
// });

// // get one product
// router.get('/:id', async (req, res, next) => {
//   try {
//     const product = await Product.findByPk(req.params.id, {
//       include: [
//         { model: Category },
//         { model: Tag, through: ProductTag },
//       ],
//     });

//     if (!product) {
//       return res.status(404).json({ error: 'Product not found' });
//     }

//     res.json(product);
//   } catch (err) {
//     next(err);
//   }
// });

// // create new product
// router.post('/', (req, res) => {
//   /* req.body should look like this...
//     {
//       product_name: "Basketball",
//       price: 200.00,
//       stock: 3,
//       tagIds: [1, 2, 3, 4]
//     }
//   */
//   Product.create(req.body)
//     .then((product) => {
//       // if there's product tags, we need to create pairings to bulk create in the ProductTag model
//       if (req.body.tagIds.length) {
//         const productTagIdArr = req.body.tagIds.map((tag_id) => {
//           return {
//             product_id: product.id,
//             tag_id,
//           };
//         });
//         return ProductTag.bulkCreate(productTagIdArr);
//       }
//       // if no product tags, just respond
//       res.status(200).json(product);
//     })
//     .then((productTagIds) => res.status(200).json(productTagIds))
//     .catch((err) => {
//       console.log(err);
//       res.status(400).json(err);
//     });
// });

// // update product
// router.put('/:id', (req, res, next) => {
//   // update product data
//   Product.update(req.body, {
//     where: {
//       id: req.params.id,
//     },
//   })
//     .then((product) => {
//       if (req.body.tagIds && req.body.tagIds.length) {
//         ProductTag.findAll({
//           where: { product_id: req.params.id },
//         })
//           .then((productTags) => {
//             // create a filtered list of new tag_ids
//             const productTagIds = productTags.map(({ tag_id }) => tag_id);
//             const newProductTags = req.body.tagIds
//               .filter((tag_id) => !productTagIds.includes(tag_id))
//               .map((tag_id) => {
//                 return {
//                   product_id: req.params.id,
//                   tag_id,
//                 };
//               });

//             // figure out which ones to remove
//             const productTagsToRemove = productTags
//               .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
//               .map(({ id }) => id);
//             // run both actions
//             return Promise.all([
//               ProductTag.destroy({ where: { id: productTagsToRemove } }),
//               ProductTag.bulkCreate(newProductTags),
//             ]);
//           })
//           .then(() => res.json(product))
//           .catch((err) => next(err));
//       } else {
//         res.json(product);
//       }
//     })
//     .catch((err) => next(err));
// });

// router.delete('/:id', async (req, res, next) => {
//   // delete one product by its `id` value
//   try {
//     const products = await Product.destroy({
//       where: {
//         id: req.params.id,
//       },
//       include: [
//         {
//           model: ProductTag,
//         },
//       ],
//     });

//     if (!products) {
//       res.status(400).json({ message: 'No product found with this id!' });
//       return;
//     }

//     res.status(200).json(products);
//   } catch (err) {
//     next(err);
//   }
// });

// module.exports = router;

const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// GET all products with associated Category and Tag data
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        { model: Category },
        { model: Tag, through: ProductTag },
      ],
    });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET one product by its `id` value with associated Category and Tag data
router.get('/:id', async (req, res) => {
  try {

    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: Category },
        { model: Tag, through: ProductTag },
      ],
    });

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create new product
router.post('/', (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {

        ProductTag.findAll({
          where: { product_id: req.params.id }
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
            .filter((tag_id) => !productTagIds.includes(tag_id))
            .map((tag_id) => {
              return {
                product_id: req.params.id,
                tag_id,
              };
            });

          // figure out which ones to remove
          const productTagsToRemove = productTags
            .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
            .map(({ id }) => id);
          // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});


// DELETE a product by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await Product.destroy({
      where: { id: productId },
    });

    if (deletedProduct === 0) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    // Delete associated product tags
    await ProductTag.destroy({
      where: { product_id: productId },
    });

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
