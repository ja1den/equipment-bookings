// Imports
const nodemailer = require("nodemailer");
const sequelize = require("./sequelize");
const { Op } = require("sequelize")
const lt = require('long-timeout')


// Transport object using .env variables
const transporter = nodemailer.createTransport({
	host: process.env.EMAIL_HOST,
	port: parseInt(process.env.EMAIL_PORT ?? '587'),
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS
	}
});



// Schedules all reminder emails at system start
const rescheduleAll = async () => {

	// Fetch all future bookings
	let activeBookings = await sequelize.models.booking.findAll({
		where: {
			start_date: {
				[Op.gt]: new Date()
			}
		}

	})

		// Error handling
		.catch((e) => {
			console.log(e)
		})
	if (activeBookings === undefined) { return }

	// Schedule all future booking reminders
	for (let i = 0; i < activeBookings.length; i++) {
		scheduleMail(activeBookings[i].start_date, activeBookings[i].email, activeBookings[i].name)
	}
}



// Email teacher and global admins upon booking placement
const notifyUsers = async (start_date, email, student_name, teacher_name) => {

	// Format readable date for html
	const start_date_readable = new Date(start_date).toLocaleString('en-AU', { dateStyle: 'medium', timeStyle: 'short' });

	// Send email with html
	send({
		from: '"Booking Manager" <media@concordia.sa.edu.au>',
		to: email,
		subject: "Equipment Booking Notification",
		text: `${student_name} has submitted an equipment booking for ${start_date_readable}`,
		html: `<p>Hello ${teacher_name},&nbsp;</p> 
        <p>This is an automated message to notify you that ${student_name} has submitted an equipment booking for ${start_date_readable}.&nbsp;</p>
        <p>Please click <a href=http://localhost:3000/report?date='${start_date_readable}'>here</a> to view the booking. You must be logged in in order to do so.
        <p>Thanks</p>`
	})
}



// Schedule email for future
const scheduleMail = async (start_date, email, name) => {

	// Calculate date in ms and generate readable date for html
	const timeInMil = new Date(start_date).getTime() - (Date.now() + 1000 * 60 * 15)
	const start_date_readable = new Date(start_date).toLocaleString('en-AU', { dateStyle: 'medium', timeStyle: 'short' });
	console.log("Email scheduled:" + timeInMil)

	// Schedule email
	lt.setTimeout(() => {
		send({
			from: '"Booking Manager" <media@concordia.sa.edu.au>',
			to: email,
			subject: "Equipment Booking Reminder",
			text: "Please collect your equipment",
			html: `<p>Hello ${name},&nbsp;</p>
            <p>This is an automated reminder to collect your equipment for the booking you made at ${start_date_readable}.&nbsp;</p>`
		})
	}, timeInMil)
}



// Send mail with mailOption object as config params
const send = async (mailOptions) => {
	return await transporter.sendMail(mailOptions)
}



// Export
module.exports = { scheduleMail, rescheduleAll, notifyUsers };
