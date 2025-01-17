import { Request, Response } from 'express';
import Customer from '../models/customer.model';

export const createCustomer = async (req: Request, res: Response) => {
  try {
    const { name, email, phone } = req.body;
    const customer = new Customer({ name, email, phone });
    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error creating customer', error });
  }
};

export const getCustomer = async (req: Request, res: Response) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customer', error });
  }
};

export const updateLoyaltyPoints = async (req: Request, res: Response) => {
  try {
    const { points } = req.body;
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    customer.loyaltyPoints += points;
    await customer.save();
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error updating loyalty points', error });
  }
}; 