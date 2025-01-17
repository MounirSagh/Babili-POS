import express from 'express';
import categoriesrouter from './category.routes';
import subcategoriesrouter from './subcategory.routes';
import cartrouter from './cart.routes';
import productrouter from './product.routes';
import orderrouter from './order.routes';
import mailrouter from './mail.routes';

const router = express.Router();

router.use("/categories", categoriesrouter);
router.use("/subcategories", subcategoriesrouter);
router.use("/cart", cartrouter);
router.use("/product", productrouter);
router.use("/order", orderrouter);
router.use("/mail", mailrouter);

export default router;