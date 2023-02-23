const router = require('express').Router();

const { isLoggedIn } = require('../lib/auth');
const enviosctrl = require('../controllers/ctrlenvios');

router.get('/', isLoggedIn, enviosctrl.list);
router.post('/envio', isLoggedIn, enviosctrl.envio);

//router.post('/editar', isLoggedIn, alumnosctrl.editar);         //se coloca esta linea
//router.get('/delete/:numero', isLoggedIn, alumnosctrl.delete);
//router.post('/add', isLoggedIn, alumnosctrl.add);

module.exports = router;