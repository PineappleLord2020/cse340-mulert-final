import { Router } from 'express';

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
    res.locals.scripts.push("<script src='/js/registration.js'></script>");
    res.render('account/register', { title: 'Register' });
});


router.post('/register', registrationValidation, async(req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPW = req.body.confirm_password;
    const register = await registerUser;

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
        res.redirect('/register');
    }

    if (email.length < 1) {
        res.redirect('/register');
        req.flash('error','Email was left blank.');
        return;
    }

    if (password.length < 8) {
        res.redirect('/register');
        req.flash('error', "Password isn't long enough.")
        return;
    }

    if (!confirmPW || password === confirmPW ) {
        res.redirect('/register');
        req.flash('error', "Passwords don't match. Please try again.")
        return;
    }

    register(email, password);
});


router.get('login', async(req, res) => {
    res.render('account/login', {title: 'Login'});
});


router.post('/login', async(req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const verify = await verifyUser;

    if (!email || !password || !confirmPW) {
        req.flash('error', 'One or more fields left blank. Please fill all fields.')
        res.redirect('/register');
    }

    if (email.length < 1) {
        res.redirect('/register');
        req.flash('error','Email was left blank.');
        return;
    }

    if (password.length < 8) {
        res.redirect('/register');
        req.flash('error', "Password isn't long enough.")
        return;
    }

    verify(email, password);
});


router.get('/', requireAuth, (req, res) => {
    res.render('account/index', {title: 'Account'});
});


export default router;