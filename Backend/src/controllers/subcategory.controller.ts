import { Request, Response } from 'express';
import SubCategory from '../models/subcategory.model'; // Adjust path as necessary

// Create a new subcategory
export const createSubCategory = async (req: Request, res: Response) => {
  try {
    const { name, categoryID } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const image = files?.['image']?.[0]?.path; // Cloudinary URL for the main image
    const tableImage = (req.files as { [fieldname: string]: Express.Multer.File[] })?.['tableImage']?.[0]?.path; // Cloudinary URL for the table image

    const newSubCategory = new SubCategory({ name, categoryID, image, tableImage });
    await newSubCategory.save();

    res.status(201).json(newSubCategory);
  } catch (error) {
    console.error('Error creating subcategory:', error);
    res.status(500).json({ message: 'Failed to create subcategory' });
  }
};

// Get all subcategories
export const getSubCategories = async (_req: Request, res: Response) => {
  try {
    const subcategories = await SubCategory.find();
    res.status(200).json(subcategories);
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    res.status(500).json({ message: 'Failed to fetch subcategories' });
  }
};

// Get subcategory by ID
export const getSubCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const subcategory = await SubCategory.findById(id);

    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }

    res.status(200).json(subcategory);
  } catch (error) {
    console.error('Error fetching subcategory by ID:', error);
    res.status(500).json({ message: 'Failed to fetch subcategory' });
  }
};

// Update subcategory
export const updateSubCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, categoryID } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const image = files?.['image']?.[0]?.path; // Cloudinary URL for the main image
    const tableImage = (req.files as { [fieldname: string]: Express.Multer.File[] })?.['tableImage']?.[0]?.path; // Cloudinary URL for the table image
    const updatedSubCategory = await SubCategory.findByIdAndUpdate(
      id,
      { name, categoryID, ...(image && { image }), ...(tableImage && { tableImage }) },
      { new: true }
    );

    if (!updatedSubCategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }

    res.status(200).json(updatedSubCategory);
  } catch (error) {
    console.error('Error updating subcategory:', error);
    res.status(500).json({ message: 'Failed to update subcategory' });
  }
};

// Delete subcategory
export const deleteSubCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedSubCategory = await SubCategory.findByIdAndDelete(id);

    if (!deletedSubCategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }

    res.status(200).json({ message: 'Subcategory deleted successfully' });
  } catch (error) {
    console.error('Error deleting subcategory:', error);
    res.status(500).json({ message: 'Failed to delete subcategory' });
  }
};

// Get subcategories by category ID
export const getSubCategoryByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const subcategories = await SubCategory.find({ categoryID: id });
    res.status(200).json(subcategories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subcategories', error });
  }
};