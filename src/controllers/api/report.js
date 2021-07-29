// Import and define routes
const express = require('express');
const router = express.Router();
const sequelize = require('../../lib/sequelize');
const auth = require('../../middleware/auth');


// Post handling - destroy record by id
router.post('/', auth, async (req, res) => {
    sequelize.models.booking.destroy({
        where:{
            id: req.body.booking_id
        }
    })
   res.redirect("/report")
});

// Get handling - foward date via query
router.get('/', auth, async (req, res) => {
    console.log(req.query.date)
    res.redirect("/report?date=" + req.query.date)
})


// Export route
module.exports = router;