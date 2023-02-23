const router = require('express').Router();

const { isLoggedIn } = require('../lib/auth');
const querysctrl = require('../controllers/ctrlquerys');

router.get('/zimc', isLoggedIn, querysctrl.zimc);
router.get('/zte', isLoggedIn, querysctrl.zte);
router.get('/ffechas', isLoggedIn, querysctrl.ffechas);
router.get('/fsedes', isLoggedIn, querysctrl.fsedes);
router.get('/fecsede', isLoggedIn, querysctrl.fecsede);
router.get('/fectotal', isLoggedIn, querysctrl.fectotal);
router.get('/fecmensual', isLoggedIn, querysctrl.fecmensual);
router.post('/listzimc', isLoggedIn, querysctrl.listzimc);
router.post('/listzte', isLoggedIn, querysctrl.listzte);
router.post('/totsedes', isLoggedIn, querysctrl.totsedes);
router.post('/totfechas', isLoggedIn, querysctrl.totfechas);
router.post('/listfectotal', isLoggedIn, querysctrl.listfectotal);
router.post('/listfecsede', isLoggedIn, querysctrl.listfecsede);
router.post('/listregmensual', isLoggedIn, querysctrl.listregmensual);

module.exports = router;