import { Router } from 'express';


const router = Router();

router.get('/', async (req, res) => {
    res.render('contact/index', { title: 'Contact' });
});

router.post('/', async (req, res) => {
    
});

export default router;