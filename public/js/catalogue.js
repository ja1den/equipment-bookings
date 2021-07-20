/* ----- Init ----- */

// Parse Table Data
const items = [];

document.querySelectorAll('#item-table tbody tr').forEach(element => items[element.dataset.recordId] = [
	element.children[0].innerHTML,
	element.children[1].innerHTML,
	element.children[2].innerHTML,
	element.children[3].innerHTML.includes('check')
]);

/* ----- Create and Update ----- */

// Locate Element
const itemForm = document.getElementById('item-form');

// Handle Submit
itemForm?.addEventListener('submit', async event => {
	// Prevent Default
	event.preventDefault();

	// Check Form
	if (itemForm.checkValidity()) {
		// Read Data
		const data = Object.fromEntries(new FormData(itemForm).entries());

		// Parse Data
		data.hidden = itemForm.querySelector('#item-hidden').checked;

		// Emit Request
		let response = null;

		if (itemForm.dataset.recordId === undefined) {
			// Create Record
			response = await fetch('/api/items', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data)
			});

			// Error?
			if (response.status === 409) return itemForm.showErrorMessage('#item-name');
			if (response.status !== 201) return;
		} else {
			// Update Record
			response = await fetch('/api/items/' + itemForm.dataset.recordId, {
				method: 'PATCH',
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
		itemForm.showInputErrors();
	}
});

/* ----- Create ----- */

// Locate Elements
const createLink = document.querySelector('a[aria-label="Create Record"]');

// Handle Click
createLink?.addEventListener('click', event => {
	// Prevent Default
	event.preventDefault();

	// Update Title
	document.querySelector('#item-modal .modal-title').innerHTML = 'Create Item';

	// Unset Record ID
	delete itemForm.dataset.recordId;
});

/* ----- Update ----- */

// Locate Elements
const updateLinks = document.querySelectorAll('a[aria-label="Update Record"]');

// Handle Click
updateLinks.forEach(element => element.addEventListener('click', event => {
	// Prevent Default
	event.preventDefault();

	// Update Title
	document.querySelector('#item-modal .modal-title').innerHTML = 'Update Item';

	// Set Record ID
	itemForm.dataset.recordId = element.dataset.recordId;

	// Populate Form
	const inputs = [...itemForm.getElementsByTagName('input')];

	inputs[0].value = items[element.dataset.recordId][0];
	inputs[1].value = items[element.dataset.recordId][1];
	inputs[2].value = items[element.dataset.recordId][2];

	inputs[3].checked = items[element.dataset.recordId][3];
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
	const response = await fetch(`/api/items/${id}`, {
		method: 'DELETE'
	});

	// Error?
	if (response.status !== 204) return;

	// Reload
	history.go();
}));
