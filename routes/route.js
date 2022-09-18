import express from  'express';
import passport from 'passport';

import { getProductById, getProducts } from '../controller/product-controller.js';
import { userSignUp, userLogIn, userInfo, getAllUsers } from '../controller/user-controller.js';
import { addPaymentGateway, paymentResponse } from '../controller/payment-controller.js';
import { redirectToGitLogin, invokeGitOAuth, oauthLoginSuccess, oauthLoginFailed, oauthLoggedOut } from '../controller/gitlogin-controller.js';
import { CLIENT_URL } from '../config.js';

const router = express.Router();

//login & signup
router.post('/api/auth/signup', userSignUp);
router.post('/api/auth/login', userLogIn);
router.get('/api/auth/userInfo', userInfo);
router.get('/api/auth/users', getAllUsers);

router.get('/api/auth/gitlogin', redirectToGitLogin);
router.get('/api/auth/oauth', invokeGitOAuth);
router.get("/api/oauth/github", passport.authenticate("github", { scope: ["profile"] }));
router.get("/api/oauth/github/callback",
  passport.authenticate("github", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/api/oauth/login/failed",
  })
);

router.get("/api/oauth/login/success", oauthLoginSuccess);
router.get("/api/oauth/login/failed", oauthLoginFailed);
router.get("/api/oauth/logout", oauthLoggedOut);

router.get('/products', getProducts);
router.get('/product/:id', getProductById);

router.post('/payment', addPaymentGateway);
router.post('/callback', paymentResponse);

export default router;