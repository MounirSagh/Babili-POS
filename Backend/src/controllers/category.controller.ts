import { Request, Response } from 'express';
import Category from '../models/category.model';


export const createCategory = async (req: Request, res: Response) => {
    try {
        const category = new Category(req.body);
        await category.save();
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ message: 'Error creating category', error });
    }
};


export const getCategories = async (req: Request, res: Response) => {
    try {
        console.log("hhh")
        const categories = await Category.find();
        console.log(categories)
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories', error });
    }
};


export const getCategoryById = async (req: Request, res: Response): Promise<void> => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            res.status(404).json({ message: 'Category not found' });
        } else {
            res.status(200).json(category);
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching category', error });
    }
};


export const updateCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!category) {
            res.status(404).json({ message: 'Category not found' });
        } else {
            res.status(200).json(category);
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating category', error });
    }
};


export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            res.status(404).json({ message: 'Category not found' });
        } else {
            res.status(200).json({ message: 'Category deleted' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting category', error });
    }
};