const router = require('express').Router();

const { isLoggedIn } = require('../lib/auth');
const entregasctrl = require('../controllers/ctrlentregas');

router.get('/', isLoggedIn, entregasctrl.list);
router.get('/view', isLoggedIn, entregasctrl.view);
router.get('/sinhuella', isLoggedIn, entregasctrl.listnohuella);
router.post('/addmanual', isLoggedIn, entregasctrl.addmanual);
router.post('/add/:numero', isLoggedIn, entregasctrl.add);
router.get('/delete/:numero', isLoggedIn, entregasctrl.delete);

module.exports = router;