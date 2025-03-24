import { Router } from 'express';
import { getAllVehicles, getClassVehicles } from '../../models/vehicles/index.js';

const router = Router();

router.get('/', async (req, res) => {
    const vehicles = await getAllVehicles();
    console.log(vehicles);
    res.render('vehicles/index', { title: 'Vehicles', vehicles });
});

router.post('/', async (req, res) => {
    
});

router.get('/:id', async (req, res) => {
    const vehicles = await getClassVehicles(req.params.id);
    console.log(vehicles);
    res.render('vehicles/index', { title: 'Vehicles', vehicles });
});

export default router;