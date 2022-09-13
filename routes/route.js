import express from  'express';

import { getProductById, getProducts } from '../controller/product-controller.js';
import { userSignUp, userLogIn, getAllUsers } from '../controller/user-controller.js';

const router = express.Router();

//login & signup
router.post('/api/auth/signup', userSignUp);
router.post('/api/auth/login', userLogIn);
router.get('/api/auth/users', getAllUsers);

router.get('/products', getProducts);
router.get('/product/:id', getProductById);

export default router;