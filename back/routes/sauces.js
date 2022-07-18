const router = require('express').Router()
const multer = require('../middleware/multer-config')
const verify = require('../middleware/verifyToken')
const saucesCtrl = require('../controllers/sauces')


// Get all sauce on homepage
router.get('/', verify, saucesCtrl.getAllSauce)

// Get one sauce 
router.get('/:id', verify, saucesCtrl.getOneSauce)

// Create a new sauce
router.post('/', verify, multer, saucesCtrl.createSauce)

// Modifiy a sauce
router.put('/:id', verify, multer, saucesCtrl.modifySauce)

// Delete a sauce
router.delete('/:id', verify, saucesCtrl.deleteSauce);

// Like and dislike sauces
router.post('/:id/like', verify, saucesCtrl.likeDislike)


module.exports = router;