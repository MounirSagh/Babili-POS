"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const subcategory_controller_1 = require("../controllers/subcategory.controller");
const router = express_1.default.Router();
router.post('/addsubcategory', subcategory_controller_1.createSubCategory);
router.get('/getsubcategories', subcategory_controller_1.getSubCategories);
router.get('/getsubcategory/:id', subcategory_controller_1.getSubCategoryById);
router.get('/getsubcategorybycategory/:id', subcategory_controller_1.getSubCategorybycategory);
router.put('/updatesubcategory/:id', subcategory_controller_1.updateSubCategory);
router.delete('/deletesubcategories/:id', subcategory_controller_1.deleteSubCategory);
exports.default = router;
