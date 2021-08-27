// Import
const nodemailer = require('nodemailer');
const lt = require('long-timeout');

const { Op } = require('sequelize');

// Lib
const sequelize = require('./sequelize');

// Initialise Transport Object
const transport = nodemailer.createTransport({
	host: process.env.EMAIL_HOST,
	port: parseInt(process.env.EMAIL_PORT ?? '587')
});

// Send mail with mailOption object as config params
const send = async mailOptions => {
	return await transport.sendMail(mailOptions)
}

// Schedules all reminder emails at system start
exports.rescheduleAll = async () => {
	// Fetch all future bookings
	const bookings = await sequelize.models.booking.findAll({
		where: {
			start_date: {
				[Op.gt]: new Date()
			}
		}
	}).catch(console.log);

	if (bookings === undefined) return;

	// Schedule all future booking reminders
	for (const booking of bookings) {
		exports.scheduleMail(booking.start_date, booking.email, booking.name);
	}
}

// Email teacher and global admins upon booking placement
exports.notifyUsers = async (start_date, email, student_name, teacher_name) => {
	// Format readable date for html
	const start_date_readable = new Date(start_date).toLocaleString('en-AU', { dateStyle: 'medium', timeStyle: 'short' });

	// Send email with html
	send({
		from: '"Equipment Booking System" <media@concordia.sa.edu.au>',
		to: email,
		subject: "Equipment Booking Notification",
		text: `${student_name} has submitted an equipment booking for ${start_date_readable}`,
		html: `<p>Hello ${teacher_name},&nbsp;</p> 
        <p>This is an automated message to notify you that ${student_name} has submitted an equipment booking for ${start_date_readable}.&nbsp;</p>
        <p>Please click <a href="http://localhost:3000/report?date=${start_date_readable}">here</a> to view the booking. You must be logged in in order to do so.
        <p>Thanks</p>`
	});
}

// Schedule email for future
exports.scheduleMail = async (start_date, email, name) => {
	// Calculate date in ms and generate readable date for html
	const timeInMil = new Date(start_date).getTime() - (Date.now() + 1000 * 60 * 15);

	const start_date_readable = new Date(start_date).toLocaleString('en-AU', { dateStyle: 'medium', timeStyle: 'short' });

	// Schedule email
	lt.setTimeout(() => {
		send({
			from: '"Equipment Booking System" <media@concordia.sa.edu.au>',
			to: email,
			subject: "Booking Notification",
			text: "Please collect your equipment",
			html: `<p>Hello ${name},&nbsp;</p>
            <p>This is an automated reminder to collect your equipment for the booking you made at ${start_date_readable}.&nbsp;</p>`
		});
	}, timeInMil);
}
