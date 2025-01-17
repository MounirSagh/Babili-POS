import express from 'express';
import { getCustomer, createCustomer, updateLoyaltyPoints } from '../controllers/customer.controller';

const router = express.Router();

router.post('/', createCustomer);
router.get('/:id', getCustomer);
router.patch('/:id/loyalty', updateLoyaltyPoints);

export default router; 