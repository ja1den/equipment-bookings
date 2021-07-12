// Locate Elements
const modals = document.getElementsByClassName('modal');

// Iterate
[...modals].forEach(modal => {
	// Locate Form
	const modalForm = modal.getElementsByTagName('form')[0];

	// Form Exists?
	if (modalForm !== undefined) {
		// Reset Styles
		modalForm.resetStyles = () => {
			modalForm.querySelectorAll('.invalid-feedback').forEach(element => element.classList.remove('d-none'));
			modalForm.querySelectorAll('input').forEach(element => element.classList.remove('is-invalid'));

			modalForm.classList.remove('was-validated');

			modalForm.querySelector(':scope > p').classList.add('d-none');
		}

		// Show Input Errors
		modalForm.showInputErrors = () => {
			modalForm.resetStyles();
			modalForm.classList.add('was-validated');
		}

		// Show Error Message
		modalForm.showErrorMessage = (match = 'input:not([type="checkbox"])') => {
			modalForm.resetStyles();

			modalForm.querySelectorAll('.invalid-feedback').forEach(element => element.classList.add('d-none'));
			modalForm.querySelectorAll(match).forEach(element => element.classList.add('is-invalid'));

			modalForm.querySelector(':scope > p').classList.remove('d-none');
		}

		// Hidden Event
		modal.addEventListener('hidden.bs.modal', () => {
			modalForm.reset();
			modalForm.resetStyles();
		});
	}
});
