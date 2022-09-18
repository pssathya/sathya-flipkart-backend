import express from  'express';

import { getProductById, getProducts } from '../controller/product-controller.js';
import { userSignUp, userLogIn, userInfo, getAllUsers } from '../controller/user-controller.js';
import { addPaymentGateway, paymentResponse } from '../controller/payment-controller.js';
import { redirectToGitLogin, invokeGitOAuth } from '../controller/gitlogin-controller.js';

const router = express.Router();

//login & signup
router.post('/api/auth/signup', userSignUp);
router.post('/api/auth/login', userLogIn);
router.get('/api/auth/userInfo', userInfo);
router.get('/api/auth/users', getAllUsers);

router.get('/api/auth/gitlogin', redirectToGitLogin);
router.get('/api/auth/oauth', invokeGitOAuth);

router.get('/products', getProducts);
router.get('/product/:id', getProductById);

router.post('/payment', addPaymentGateway);
router.post('/callback', paymentResponse);

export default router;