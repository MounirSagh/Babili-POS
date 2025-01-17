import customerRoutes from './routes/customer.routes';
import discountRoutes from './routes/discount.routes';

app.use('/api/customers', customerRoutes);
app.use('/api/discounts', discountRoutes); 