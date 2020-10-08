import { Router } from 'express';

import { can, Action } from '../config/Permissions';
import CategoryController from '../controllers/CategoryController';

const router = Router();

router.get('/allCategories', async (req, res) => {
  if (can(req.user, Action.ViewCategories)) {
    return res.status(200).json(await CategoryController.getAllCategories().catch(error => {
      console.log((error as Error).message);
      res.status(500).send((error as Error).message);
    }));
  }

  return res.status(401).send('Not enough permissions to view categories.');
});

router.get('/allCategoriesCriteria', async (req, res) => {
  if (can(req.user, Action.ViewCategoriesCriteria)) {
    return res.status(200).json(await CategoryController.getAllCategoriesWithCriteria().catch(error => {
      console.log((error as Error).message);
      res.status(500).send((error as Error).message);
    }));
  }

  return res.status(401).send('Not enough permissions to view categories.');
});

router.post('/update', async (req, res) => {
  if (can(req.user, Action.UpdateCategory)) {
    return res.status(200).json(await CategoryController.updateCategory(req.body.categories).catch(error => {
      console.log((error as Error).message);
      res.status(500).send((error as Error).message);
    }));
  }

  return res.status(401).send('Not enough permissions to edit or create categories.');
});

router.post('/delete', async (req, res) => {
  // console.log(req.body);
  if (can(req.user, Action.DeleteCategory)) {
    return res.status(200).json(await CategoryController.deleteCategory(req.body.categoryID).catch(error => {
      console.log((error as Error).message);
      res.status(500).send((error as Error).message);
    }));
  }

  return res.status(401).send('Not enough permissions to delete categories.');
});

router.delete('/deleteGenerated', async (req, res) => {
  if (can(req.user, Action.DeleteCategory)) {
    return res.status(200).json(await CategoryController.deleteGeneratedCategories().catch(error => {
      console.log((error as Error).message);
      res.status(500).send((error as Error).message);
    }));
  }

  return res.status(401).send('Not enough permissions to delete categories.');
});

router.get('/companies', async (req, res) => {
  if (can(req.user, Action.ViewCategories)) {
    return res.status(200).json(await CategoryController.getCategoryCompanies().catch(error => {
      console.log((error as Error).message);
      res.status(500).send((error as Error).message);
    }));
  }

  return res.status(401).send('Not enough permissions to get company categories.');
});

export default router;
