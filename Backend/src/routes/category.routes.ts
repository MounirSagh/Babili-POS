import express from 'express';
import { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory } from '../controllers/category.controller';

const router = express.Router();

router.post('/addcategory', createCategory);         
router.get('/getcategories', getCategories);          
router.get('/getcategory/:id', getCategoryById);    
router.put('/updatecategory/:id', updateCategory);      
router.delete('/deletecategory/:id', deleteCategory);   

export default router;