/* ----- Locate Elements ----- */

// User Form
const userForm = document.getElementById('user-form');

// Create Link
const createLink = document.querySelector('a[aria-label="Create Record"]');

// Update and Delete
const updateLinks = document.querySelectorAll('a[aria-label="Update Record"]');
const deleteLinks = document.querySelectorAll('a[aria-label="Delete Record"]');

/* ----- Setup ----- */

// Parse Table Data
const users = [];

document.querySelectorAll('#user-table tbody tr').forEach(element => users[element.dataset.recordId] = [
	element.children[0].innerHTML,
	element.children[1].innerHTML,
	element.children[2].innerHTML.includes('check'),
	element.children[3].innerHTML.includes('check'),
]);

/* ----- Create and Update ----- */

// Handle Submit
userForm?.addEventListener('submit', async (event) => {
	// Prevent Default
	event.preventDefault();

	// Check Form
	if (userForm.checkValidity()) {
		// Read Data
		const data = Object.fromEntries(new FormData(userForm).entries());

		// Parse Data
		if (data.password === '') delete data.password;

		data.global = userForm.querySelector('#user-global').checked;
		data.hidden = userForm.querySelector('#user-hidden').checked;

		// Emit Request
		let response = null;

		if (userForm.dataset.recordId === undefined) {
			// Create Record
			response = await fetch('/api/users', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			});

			// Error?
			if (response.status === 409) return userForm.showErrorMessage('#user-name, #user-email');
			if (response.status !== 201) return;
		} else {
			// Update Record
			response = await fetch('/api/users/' + userForm.dataset.recordId, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			});

			// Error?
			if (response.status !== 204) return;
		}

		// Reload
		history.go();
	} else {
		// Show Input Errors
		userForm.showInputErrors();
	}
});

/* ----- Create ----- */

// Handle Click
createLink?.addEventListener('click', (event) => {
	// Prevent Default
	event.preventDefault();

	// Update Title
	document.querySelector('#user-modal .modal-title').innerHTML = 'Create User';

	// Unset Record ID
	delete userForm.dataset.recordId;

	// Require Password
	userForm.querySelector('#user-password').setAttribute('required', '');

	// Enable Global
	userForm.querySelector('#user-global').removeAttribute('disabled');

	// Hide Popover
	userForm.querySelector('label i.bi-info-circle').classList.add('d-none');
});

/* ----- Update ----- */

// Handle Click
updateLinks.forEach(element => element.addEventListener('click', (event) => {
	// Prevent Default
	event.preventDefault();

	// Update Title
	document.querySelector('#user-modal .modal-title').innerHTML = 'Update User';

	// Unrequire Password
	userForm.querySelector('#user-password').removeAttribute('required');

	// Disable Global
	if (element.dataset.current !== undefined) {
		userForm.querySelector('#user-global').setAttribute('disabled', '');
	} else {
		userForm.querySelector('#user-global').removeAttribute('disabled');
	}

	// Show Popover
	userForm.querySelector('label i.bi-info-circle').classList.remove('d-none');

	// Set Record ID
	userForm.dataset.recordId = element.dataset.recordId;

	// Populate Form
	const inputs = [...userForm.getElementsByTagName('input')];

	inputs[0].value = users[element.dataset.recordId][0];
	inputs[1].value = users[element.dataset.recordId][1];

	inputs[3].checked = users[element.dataset.recordId][2];
	inputs[4].checked = users[element.dataset.recordId][3];
}));

/* ----- Delete ----- */

// Handle Click
deleteLinks.forEach(element => element.addEventListener('click', async (event) => {
	// Prevent Default
	event.preventDefault();

	// Confirm?
	if (!confirm('Are you sure?')) return;

	// Read ID
	const id = element.dataset.recordId;

	// Emit Request
	const response = await fetch(`/api/users/${id}`, {
		method: 'DELETE',
	});

	// Error?
	if (response.status !== 204) return;

	// Reload
	history.go();
}));
