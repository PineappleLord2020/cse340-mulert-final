import { Router } from 'express';
import { body, validationResult } from "express-validator";
import { requireAuth } from "../../utils/index.js";
import {registerUser, userExist} from "../../models/accounts/index.js"

const registrationValidation = [
    body("email")
        .isEmail()
        .withMessage("Invalid email format."),
    body("password")
        .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)
        .withMessage("Password must be at least 8 characters long, include one uppercase letter, one number, and one symbol.")
];

const router = Router();

router.get('/register', async(req, res) => {
    res.render('account/register', { title: 'Register' });
});


router.post('/register', registrationValidation, async(req, res) => {
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPW = req.body.confirm_password;
    /*const register = await registerUser;*/

    const results = validationResult(req);
    if (results.errors.length > 0) {
        results.errors.forEach((error) => {
            req.flash('error', error.msg);
        });
        res.redirect('/account/register');
        return;
    }

    if (!email || !password || !confirmPW) {
        req.flash('error', 'One or more fields left blank. Please fill all fields.')
        res.redirect('/account/register');
    }

    if (email.length < 1) {
        req.flash('error','Email was left blank.');
        res.redirect('/account/register');
        return;
    }

    if (password.length < 8) {
        req.flash('error', "Password isn't long enough.");
        res.redirect('/account/register');
        return;
    }

    if (!confirmPW || password === confirmPW ) {
        req.flash('error', "Passwords don't match. Please try again.");
        res.redirect('/account/register');
        return;
    }

    if (userExist(email)) {
        req.flash('error', "User already exists. Please Login.");
        res.redirect('/account/login');
        return;
    }

    await registerUser(fname, lname, email, password);
    res.redirect('/account/login');
});


router.get('/login', async(req, res) => {
    res.render('account/login', {title: 'Login'});
});


router.post('/login', registrationValidation, async(req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    //const verify = await verifyUser;

    if (!email || !password || !confirmPW) {
        req.flash('error', 'One or more fields left blank. Please fill all fields.')
        res.redirect('/account/register');
    }

    if (email.length < 1) {
        req.flash('error','Email was left blank.');
        res.redirect('/account/register');
        return;
    }

    if (password.length < 8) {
        req.flash('error', "Password isn't long enough.")
        res.redirect('/account/register');
        return;
    }

    const userData = userExist(email, password);
    if (!userData) {
        req.flash('error', "Email or Password incorrect. Please try again")
        res.redirect('/account/login');
        return;
    }

    delete userData.password;
    req.session.user = userData;
    return res.redirect('/account');
});


router.get('/', requireAuth, (req, res) => {
    res.render('account/index', {title: 'Account'});
});


export default router;