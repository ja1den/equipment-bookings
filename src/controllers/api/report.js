// Import and define routes
const express = require('express');
const router = express.Router();
const sequelize = require('../../lib/sequelize');
const auth = require('../../middleware/auth');


// Post Handling
router.post('/', auth, async (req, res) => {
    console.log(req.body.booking_id)

    sequelize.models.booking.destroy({
        where:{
            id: req.body.booking_id
        }
    })

   res.redirect("/report")
});
router.get('/', auth, async (req, res) => {
    console.log(req.query.date)
    res.redirect("/report?date=" + req.query.date)
})


// Export route
module.exports = router;