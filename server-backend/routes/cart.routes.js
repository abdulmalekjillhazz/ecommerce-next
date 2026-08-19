const express = require('express');
const { getCart, syncCart, mergeGuestCart, clearCart } = require('../controllers/cart.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);
router.get('/', getCart);
router.put('/sync', syncCart);
router.post('/merge', mergeGuestCart);
router.delete('/', clearCart);

module.exports = router;
