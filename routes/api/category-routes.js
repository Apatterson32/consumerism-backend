// const router = require('express').Router();
// const { Category, Product } = require('../../models');

// // The `/api/categories` endpoint

// router.get('/', async(req, res) => {
//   // find all categories
//   // be sure to include its associated Products
//   try {
//     const categories = await Category.findAll({
//       include: [{ model: Product }]
//   });
//     res.status(200).json(categories);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// router.get('/:id', async(req, res) => {
//   // find one category by its `id` value
//   // be sure to include its associated Products
//   try {
//     const categories = await Category.findByPk(req.params.id, {
//       include: [{ model: Product }]
//     });

//     if (!categories) {
//       res.status(404).json({ message: 'No category found with this id!'});
//       return;
//     }

//     res.status(200).json(categories);
//   } catch (err) {
//     req.status(500).json(err);
//   }
// });

// router.post('/', async(req, res) => {
//   // create a new category
//   try {
//     const categories = await Category.create(req.body);
//     res.status(200).json(categories);
//   } catch (err) {
//     res.status(400).json(err);
//   }
// });


// router.put('/:id', async (req, res) => {
//   // update a category by its `id` value
//   try {
//     const categories = await Category.update(req.body, {
//       where: {
//         id: req.params.id
//       }
//     });

//     if (!categories) {
//       res.status(400).json({ message: 'No category found with this id!'});
//       return;
//     }

//     res.status(200).json(categories);
//   } catch (err) {
//     res.status(500).json(err);
//   }  
// });


// router.delete('/:id', async(req, res) => {
//   // delete a category by its `id` value
//   try {
//     const categories = await Category.destroy({
//       where: {
//         id: req.params.id
//       }
// });

// if (!categories) {
//   res.status(400).json({ message: 'No category found with this id!'});
//   return;
// }

// res.status(200).json(categories);
// } catch (err) {
// res.status(500).json(err);
// }
// });



// module.exports = router;

const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

// GET all categories with their associated products
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [{ model: Product }],
    });
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET a single category by its `id` value with associated products
router.get('/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findByPk(categoryId, {
      include: [{ model: Product }],
    });

    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    res.status(200).json(category);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST create a new category
router.post('/', async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(400).json(err);
  }
});

// PUT update a category by its `id` value
router.put('/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;
    const updatedCategory = await Category.update(req.body, {
      where: { id: categoryId },
    });

    if (updatedCategory[0] === 0) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    res.status(200).json({ message: 'Category updated successfully' });
  } catch (err) {
    res.status(400).json(err);
  }
});

// DELETE a category by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;
    const deletedCategory = await Category.destroy({
      where: { id: categoryId },
    });

    if (deletedCategory === 0) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;