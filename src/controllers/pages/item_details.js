// Imports
const sequelize = require('../../lib/sequelize');


// Export Route
module.exports = async (req, res) => {
    // Init
    let records;
    let isAuth = req.isAuthenticated();

    // Fetch item list
    let items = await sequelize.models.item.findAll({
    })


    if (req.query.item_id == undefined){
        req.query.item_id = items[0].id
    }

    records = await sequelize.models.booking_item.findAll({
        where: {
            item_id: req.query.item_id
        },
        required:true,
        include:[{
            model: sequelize.models.booking,
            required: true,
            nested: true,
        }]
    })
    
    .catch((e) => {
        console.log(e)
        res.status(500).send()
    });
    
    if (records === undefined) return;

    

	// Render view
    res.render('item_details', { user: req.user, items, records, isAuth });
}
