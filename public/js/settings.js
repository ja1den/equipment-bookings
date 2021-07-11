/* ----- Init ----- */

// Parse Table Data
const users = [];

document.querySelectorAll('#user-table tbody tr').forEach(element => users[element.dataset.recordId] = [
	element.children[0].innerHTML,
	element.children[1].innerHTML,
	element.children[2].innerHTML.includes('check'),
	element.children[3].innerHTML.includes('check')
]);

/* ----- Create and Update ----- */

// Locate Element
const userForm = document.getElementById('user-form');

// Handle Submit
userForm?.addEventListener('submit', async event => {
	// Prevent Default
	event.preventDefault();

	// Check Form
	if (userForm.checkValidity()) {
		// Read Data
		const data = Object.fromEntries(new FormData(userForm).entries());

		// Parse Data
		data.global = data.global === 'on';
		data.hidden = data.hidden === 'on';

		// Emit Request
		let response = null;

		if (userForm.dataset.recordId === undefined) {
			// Create Record
			response = await fetch('/api/users', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data)
			});

			// Error?
			if (response.status === 409) return userForm.showErrorMessage('#user-name, #user-email');
			if (response.status !== 201) return;
		} else {
			// Update Record
			response = await fetch('/api/users/' + userForm.dataset.recordId, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data)
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

const createLink = document.querySelector('a[aria-label="Create Record"]');

createLink.addEventListener('click', event => {
	// Prevent Default
	event.preventDefault();

	// Update Title
	document.querySelector('#user-modal .modal-title').innerHTML = 'Create User';

	// Unset Record ID
	delete userForm.dataset.recordId;
});

/* ----- Update ----- */

// Locate Elements
const updateLinks = document.querySelectorAll('a[aria-label="Update Record"]');

// Handle Click
updateLinks.forEach(element => element.addEventListener('click', event => {
	// Prevent Default
	event.preventDefault();

	// Update Title
	document.querySelector('#user-modal .modal-title').innerHTML = 'Update User';

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

// Locate Elements
const deleteLinks = document.querySelectorAll('a[aria-label="Delete Record"]');

// Handle Click
deleteLinks.forEach(element => element.addEventListener('click', async event => {
	// Prevent Default
	event.preventDefault();

	// Confirm?
	if (!confirm('Are you sure?')) return;

	// Read ID
	const id = element.dataset.recordId;

	// Emit Request
	const response = await fetch(`/api/users/${id}`, {
		method: 'DELETE'
	});

	// Error?
	if (response.status !== 204) return;

	// Reload
	history.go();
}));
