const router = require('express').Router();

const { isLoggedIn } = require('../lib/auth');
const sedesctrl = require('../controllers/ctrlsedes');

router.get('/', isLoggedIn, sedesctrl.list);
router.get('/add', sedesctrl.add);
router.post('/add', sedesctrl.new);
router.get('/edit/:codsede', sedesctrl.edit);
router.post('/edit/:codsede', sedesctrl.update);
router.get('/delete/:codsede', sedesctrl.delete);

module.exports = router;