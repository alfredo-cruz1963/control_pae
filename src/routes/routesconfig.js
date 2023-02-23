const router = require('express').Router();

const { isLoggedIn } = require('../lib/auth');
const configctrl = require('../controllers/ctrlconfig');

router.get('/', isLoggedIn, configctrl.list);
router.post('/add', isLoggedIn, configctrl.add);
router.get('/update/:id', isLoggedIn, configctrl.edit);
router.post('/update/:id', isLoggedIn, configctrl.update);
router.get('/delete/:id', isLoggedIn, configctrl.delete);

module.exports = router;