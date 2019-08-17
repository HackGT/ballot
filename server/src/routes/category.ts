import { Router } from 'express';

import { can, Action } from '../config/Permissions';
import CategoryController from '../controllers/CategoryController';

const router = Router();

router.get('/allCategories', async (req, res) => {
  if (can(req.user, Action.ViewCategories)) {
    return res.status(200).json(await CategoryController.getAllCategories());
  }

  return res.status(401).send('Not enough permissions to view categories.');
})

router.get('/allCategoriesCriteria', async (req, res) => {
  if (can(req.user, Action.ViewCategoriesCriteria)) {
    return res.status(200).json(await CategoryController.getAllCategoriesWithCriteria());
  }

  return res.status(401).send('Not enough permissions to view categories.');
});

router.post('/update', async (req, res) => {
  if (can(req.user, Action.UpdateCategory)) {
    return res.status(200).json(await CategoryController.updateCategory(req.body.categories));
  }

  return res.status(401).send('Not enough permissions to edit or create categories.');
});

router.post('/delete', async (req, res) => {
  console.log(req.body);
  if (can(req.user, Action.DeleteCategory)) {
    return res.status(200).json(await CategoryController.deleteCategory(req.body.categoryID));
  }

  return res.status(401).send('Not enough permissions to delete categories.');
});

router.delete('/deleteGenerated', async (req, res) => {
  if (can(req.user, Action.DeleteCategory)) {
    return res.status(200).json(await CategoryController.deleteGeneratedCategories());
  }

  return res.status(401).send('Not enough permissions to delete categories.');
});

export default router;
