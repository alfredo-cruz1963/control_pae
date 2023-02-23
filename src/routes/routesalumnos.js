const router = require('express').Router();

const { isLoggedIn } = require('../lib/auth');
const alumnosctrl = require('../controllers/ctrlalumnos');

router.get('/', isLoggedIn, alumnosctrl.list);
router.get('/view', isLoggedIn, alumnosctrl.view);
router.post('/update/:numero', isLoggedIn, alumnosctrl.update);
router.post('/updateface/:numero', isLoggedIn, alumnosctrl.updateface);
router.post('/searchFace/:codsede', isLoggedIn, alumnosctrl.searchFace);
router.get('/delete/:numero', isLoggedIn, alumnosctrl.delete);
router.post('/add', isLoggedIn, alumnosctrl.add);
router.get('/search', isLoggedIn, alumnosctrl.search);
router.post('/consultar', isLoggedIn, alumnosctrl.consultar);

module.exports = router;