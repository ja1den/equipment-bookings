// Export Route
const sequelize = require('../../lib/sequelize');
const { Op } = require('sequelize');
const moment = require('moment')



// Main
module.exports = async (req, res) => {
    
	// Require login for page access
	if (!req.isAuthenticated()) return res.redirect('/');

    // Initial declerations
    let start_date
    let end_date
    let read_date

    // Format start and end dates
    if (req.query.date == undefined){
        start_date = moment().startOf('day')
        end_date = moment().endOf('day')
        read_date = moment(start_date).format('YYYY-MM-DDThh:mm')
        
    } else {
        read_date = moment(req.query.date).format('YYYY-MM-DDThh:mm')
        start_date = moment(read_date).startOf('day')
        end_date = moment(read_date).endOf('day')
    }

    // Fetch records
    let records = await sequelize.models.booking.findAll({
        where: {
            start_date: {
                [Op.lt]: end_date
            },
            end_date: {
                [Op.gt]: start_date
            }
        },
        include:[{
            model: sequelize.models.booking_item,
            required: true,
            nested: true,
            include: [{
                model: sequelize.models.item,
                required: true,
                nested: true
            }]
        }]
    })
    
    // Handle errors
    .catch((e) => {
        console.log(e)
        res.status(500).send()

    });
    if (records === undefined) return;


	// Render view
	res.render('report', { user: req.user, records, read_date});
}
