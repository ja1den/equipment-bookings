// Locate Elements
const forms = document.getElementsByTagName('form');

// Iterate
[...forms].forEach(form => {
	// Reset Styles
	form.resetStyles = () => {
		form.querySelectorAll('.invalid-feedback').forEach(element => element.classList.remove('d-none'));
		form.querySelectorAll('input').forEach(element => element.classList.remove('is-invalid'));

		form.classList.remove('was-validated');

		form.querySelector('.text-danger').classList.add('d-none');
	}

	// Show Input Errors
	form.showInputErrors = () => {
		form.resetStyles();
		form.classList.add('was-validated');
	}

	// Show Error Message
	form.showErrorMessage = (match = 'input:not([type="checkbox"])') => {
		form.resetStyles();

		form.querySelectorAll('.invalid-feedback').forEach(element => element.classList.add('d-none'));
		form.querySelectorAll(match).forEach(element => element.classList.add('is-invalid'));

		form.querySelector('.text-danger').classList.remove('d-none');
	}
});
