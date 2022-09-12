import express from  'express';

import { getProductById, getProducts } from '../controller/product-controller.js';
import { userSignUp, userLogIn, getAllUsers } from '../controller/user-controller.js';

const router = express.Router();

//login & signup
router.post('/signup', userSignUp);
router.post('/login', userLogIn);
router.get('/users', getAllUsers);

router.get('/products', getProducts);
router.get('/product/:id', getProductById);

export default router;