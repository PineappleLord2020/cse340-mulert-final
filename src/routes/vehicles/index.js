import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
    res.render('vehicles/index', { title: 'Vehicles' });
});

router.post('/', async (req, res) => {
    
});

export default router;