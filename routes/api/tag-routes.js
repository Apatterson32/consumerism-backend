// const router = require('express').Router();
// const { Tag, Product, ProductTag } = require('../../models');

// // The `/api/tags` endpoint

// router.get('/', async (req, res) => {
//   // find all tags
//   // be sure to include its associated Product data
//   try {
//     const tagData = await Tag.findAll({
//       include: [
//         {
//           model: Product,
//           through: ProductTag,
//           as: 'tagged_products'
//         },
//       ],
//     });
//     res.status(200).json(tagData);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// router.get('/:id', async (req, res) => {
//   // find a single tag by its `id`
//   // be sure to include its associated Product data
//   try {
//     const tagData = await Tag.findByPk(req.params.id, {
//       include: [
//         {
//           model: Product,
//           through: ProductTag,
//           as: 'tagged_products'
//         },
//       ],
//     });

//     if (!tagData) {
//       res.status(404).json({ message: 'No Tag found with this id!'});
//       return;
//     }

//     res.status(200).json(tagData);
//   } catch (err) {
//     req.status(500).json(err);
//   }
// });
// // Needs to be reworked
// router.post('/', async (req, res) => {
//   // create a new tag
//   try {
//     const tagData = await Tag.create(req.body);
//     res.status(200).json(tagData);
//   } catch (err) {
//     res.status(400).json(err);
//   }
// });

// router.put('/:id', async (req, res) => {
//   // update a tag's name by its `id` value
//   try {
//     const tagData = await Tag.update(req.body, {
//       where: {
//         id: req.params.id,
//       },
//     });

//     if (!tagData) {
//       res.status(400).json({ message: 'No tag found with this id!'});
//       return;
//     }

//     res.status(200).json(tagData);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// router.delete('/:id', async (req, res) => {
//   // delete on tag by its `id` value
//   try {
//     const tagData = await Tag.destroy({
//       where: {
//         id: req.params.id,
//       },
//     });

//     if (!tagData) {
//       res.status(400).json({ message: 'No tag found with this id!'});
//       return;
//     }

//     res.status(200).json(tagData);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// module.exports = router;

const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

// GET all tags with associated Product data
router.get('/', async (req, res) => {
  try {
    const tags = await Tag.findAll({
      include: [{ model: Product, through: ProductTag }],
    });
    res.status(200).json(tags);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET one tag by its `id` value with associated Product data
router.get('/:id', async (req, res) => {
  try {
    const tagId = req.params.id;
    const tag = await Tag.findByPk(tagId, {
      include: [{ model: Product, through: ProductTag }],
    });

    if (!tag) {
      res.status(404).json({ message: 'Tag not found' });
      return;
    }

    res.status(200).json(tag);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST create a new tag
router.post('/', async (req, res) => {
  try {
    const newTag = await Tag.create(req.body);
    res.status(201).json(newTag);
  } catch (err) {
    res.status(400).json(err);
  }
});

// PUT update a tag's name by its `id` value
router.put('/:id', async (req, res) => {
  try {
    const tagId = req.params.id;
    const updatedTag = await Tag.update(req.body, {
      where: { id: tagId },
    });

    if (updatedTag[0] === 0) {
      res.status(404).json({ message: 'Tag not found' });
      return;
    }

    res.status(200).json({ message: 'Tag updated successfully' });
  } catch (err) {
    res.status(400).json(err);
  }
});

// DELETE a tag by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const tagId = req.params.id;
    const deletedTag = await Tag.destroy({
      where: { id: tagId },
    });

    if (deletedTag === 0) {
      res.status(404).json({ message: 'Tag not found' });
      return;
    }

    res.status(200).json({ message: 'Tag deleted successfully' });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
