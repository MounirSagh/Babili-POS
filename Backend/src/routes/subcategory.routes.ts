import express, { Request, Response, RequestHandler } from 'express';
import {
  createSubCategory,
  getSubCategories,
  getSubCategoryById,
  getSubCategoryByCategory,
  updateSubCategory,
  deleteSubCategory,
} from '../controllers/subcategory.controller';

const router = express.Router();

// Route with exact path matching frontend request
router.get('/getsubcategories', getSubCategories as RequestHandler);

// Other routes...
router.post('/addsubcategory', createSubCategory as RequestHandler);
router.get('/getsubcategory/:id', getSubCategoryById as RequestHandler);
router.get('/getsubcategorybycategory/:id', getSubCategoryByCategory as RequestHandler);
router.put('/updatesubcategory/:id', updateSubCategory as RequestHandler);
router.delete('/deletesubcategories/:id', deleteSubCategory as RequestHandler);

export default router;
