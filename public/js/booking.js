/* ----- Locate Elements ----- */

// Booking Form
const bookingForm = document.getElementById('booking-form');

// Date Inputs
const startDate = document.getElementById('booking-start');
const endDate = document.getElementById('booking-end');

// Item List
const itemList = document.getElementById('item-list');

// Status Elements
const loadingIcon = document.getElementById('loading-icon');
const emptyText = document.getElementById('empty-text');

// Create Button
const createButton = document.getElementById('create-button');

/* ----- Global ----- */

// Item Template
const itemTemplate = document.getElementById('booking-item-%').outerHTML.replace('style="display:none;"', '');

// Item Total
let itemTotal = 0;

// Request Data
let bookings = [];
let items = [];

// Processed Data
let stock = {};

/* ----- Handle Dates ----- */

// Handle Update
startDate?.addEventListener('change', async () => {
	// Update Minimum
	endDate.setAttribute('min', startDate.value);

	// Update Input
	if (new Date(startDate.value) > new Date(endDate.value)) {
		endDate.value = startDate.value;
	}

	// Update Form
	await resetForm();
});

// Handle Update
endDate?.addEventListener('change', async () => await resetForm());

/* ----- Create Item ----- */

// Handle Click
createButton?.addEventListener('click', () => {
	// First Entry?
	if (itemList.querySelector('select') === null) {
		// Hide Empty Text
		emptyText.classList.add('d-none');
	}

	// Insert Item
	itemList.insertAdjacentHTML('beforeend', itemTemplate.replace(/%/g, itemTotal));

	// Get Item
	const itemElement = document.getElementById('booking-item-' + itemTotal);

	// Locate Inputs
	const select = itemElement.getElementsByTagName('select')[0];
	const inputs = itemElement.getElementsByTagName('input');

	// Clear Select
	select.innerHTML = '<option disabled hidden selected></option>';

	// Populate Select
	let optgroup = undefined;

	items.forEach((item, index) => {
		// Next Group
		if (item.category !== optgroup?.getAttribute('label')) {
			optgroup = document.createElement('optgroup');

			optgroup.setAttribute('label', item.category);

			select.appendChild(optgroup);
		}

		// Next Item
		const option = document.createElement('option');

		option.innerHTML = item.name;

		option.value = index;

		optgroup.appendChild(option);
	});

	// Handle Change
	select.addEventListener('change', () => {
		// Read Select
		const max = stock[items[select.value].category][items[select.value].name];

		// Update Inputs
		inputs[0].value = 0;
		inputs[1].value = Math.max(0, max);

		// Update Range
		inputs[0].setAttribute('max', max);

		// Prevent Duplicates
		preventDuplicates();
	});

	// Locate Remove
	itemElement.getElementsByTagName('button')[0]?.addEventListener('click', () => {
		// Remove Element
		itemElement.remove();

		// Empty?
		if (itemList.querySelector('select') === null) {
			// Show Empty Text
			emptyText.classList.remove('d-none');
		}

		// Prevent Duplicates
		preventDuplicates();
	});

	// Set Inputs
	inputs[0].value = '';
	inputs[1].value = '';

	// Update Total
	itemTotal++;

	// Prevent Duplicates
	preventDuplicates();
});

// Prevent Duplicates
const preventDuplicates = () => {
	// Get Selected Items
	const list = [...itemList.querySelectorAll('select').values()].map(select => select.value);

	// Disable Selected
	itemList.querySelectorAll('option').forEach((option) => {
		// Ignore Hidden
		if (option.hidden) return;

		// Disable?
		option.toggleAttribute('disabled', list.includes(option.value) && !option.selected);
	});
};

/* ----- Reset Form ----- */

// Reset Form
const resetForm = async () => {
	// Toggle Elements
	loadingIcon.classList.remove('d-none');
	emptyText.classList.add('d-none');

	createButton.classList.add('d-none');

	// Reset Items
	itemList.innerHTML = '';

	// Read Data
	const data = Object.fromEntries(new FormData(bookingForm).entries());

	// Check Dates
	if (data.start_date === '' || data.end_date === '') return;

	// Parse Dates
	data.start_date = new Date(data.start_date);
	data.end_date = new Date(data.end_date);

	// Request Bookings
	bookings = await fetch('/api/bookings?start_date=' + data.start_date.toJSON() + '&end_date=' + data.end_date.toJSON(), {
		method: 'GET',
	}).then(response => response.json());

	// Request Items
	items = await fetch('/api/items', { method: 'GET' }).then(response => response.json());

	items.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));

	// Process Requests
	stock = items.reduce((data, item) => ({ ...data, [item.category]: { ...data[item.category] ?? {}, [item.name]: item.stock } }), {});

	bookings.forEach(booking => booking.items.forEach(item => stock[item.category][item.name] -= item.booking_item.quantity));

	items = items.filter(item => !item.hidden);

	// Toggle Elements
	emptyText.classList.remove('d-none');
	loadingIcon.classList.add('d-none');

	createButton.classList.remove('d-none');
};
resetForm();

/* ----- Submit ----- */

// Handle Submit
bookingForm?.addEventListener('submit', async (event) => {
	// Prevent Default
	event.preventDefault();

	// Check Form
	if (bookingForm.checkValidity()) {
		// Read Data
		const data = Object.fromEntries(new FormData(bookingForm).entries());

		// Parse Data
		const parsed = { name: data.name, email: data.email, comment: data.comment };

		parsed.start_date = new Date(data.start_date);
		parsed.end_date = new Date(data.end_date);

		if (data.user_id !== '-1') parsed.user_id = parseInt(data.user_id);

		parsed.items = [];

		Object.keys(data).sort().forEach((key) => {
			const index = key.match(/item-(\d+)/)?.[1] ?? null;
			if (index === null) return;

			if (parsed.items[index] === undefined) parsed.items[index] = [];

			if (/item-\d+-index/.test(key)) parsed.items[index][0] = parseInt(items[data[key]].id);
			if (/item-\d+-amount/.test(key)) parsed.items[index][1] = parseInt(data[key]);
		});

		parsed.items = parsed.items.filter(item => item && item[1] !== 0);

		// No Items?
		if (parsed.items.length === 0) return bookingForm.showErrorMessage(':not(*)');

		// Emit Request
		const response = await fetch('/api/bookings', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(parsed),
		});

		// Error?
		if (response.status !== 201) return;

		// Reload
		history.go();
	} else {
		// Show Input Errors
		bookingForm.showInputErrors();
	}
});
