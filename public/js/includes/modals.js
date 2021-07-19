// Locate Elements
const modals = document.getElementsByClassName('modal');

// Iterate
[...modals].forEach(modal => {
	// Locate Form
	const modalForm = modal.getElementsByTagName('form')[0];

	// Bind Events
	modal.addEventListener('hidden.bs.modal', () => {
		modalForm?.reset();
		modalForm?.resetStyles();
	});
});
