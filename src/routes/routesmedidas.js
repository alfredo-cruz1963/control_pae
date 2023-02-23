const router = require('express').Router();

const { isLoggedIn } = require('../lib/auth');
const medidasctrl = require('../controllers/ctrlmedidas');

router.get('/', isLoggedIn, medidasctrl.list);
router.post('/add', isLoggedIn, medidasctrl.add);
router.post('/save/:numero', isLoggedIn, medidasctrl.save);
router.get('/delete/:numero', isLoggedIn, medidasctrl.delete);
router.get('/view/:numero', isLoggedIn, medidasctrl.view);

module.exports = router;