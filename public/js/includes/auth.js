/* ---------- Elements ---------- */

// Login
const loginModal = document.getElementById('login-modal');
const loginForm = document.getElementById('login-form');

// Logout
const logoutLink = document.getElementById('logout-link');

/* ---------- Login ---------- */

// Reset Form Styles
const resetFormStyles = () => {
	// Reset Styles
	loginForm.querySelectorAll('input').forEach(element => {
		element.classList.remove('is-invalid');
	});

	loginForm.querySelectorAll('.invalid-feedback').forEach(element => {
		element.classList.remove('d-none');
	});

	loginForm.classList.remove('was-validated');

	// Hide Error Message
	loginForm.querySelector('p').classList.add('d-none');
}

// Handle Modal
loginModal?.addEventListener('show.bs.modal', () => {
	// Reset Styles
	resetFormStyles();

	// Reset Inputs
	loginForm.reset();
});

// Handle Login
loginForm?.addEventListener('submit', async event => {
	// Prevent Default
	event.preventDefault();

	// Reset Styles
	resetFormStyles();

	// Check Form
	const isValid = loginForm.checkValidity();

	// Check Succeeded?
	if (isValid) {
		// Parse Form Data
		const data = [...new FormData(loginForm).entries()].reduce(
			(data, entry) => ({
				...data, [entry[0]]: entry[1]
			}), {}
		);

		// Emit Request
		const response = await fetch('/api/auth', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data)
		});

		// Success?
		if (response.status !== 401) return history.go();

		// Handle Error
		loginForm.querySelector('p').classList.remove('d-none');

		// Update Styles
		loginForm.querySelectorAll('input').forEach(element => {
			element.classList.add('is-invalid');
		});

		loginForm.querySelectorAll('.invalid-feedback').forEach(element => {
			element.classList.add('d-none');
		});
	} else {
		// Update Style
		loginForm.classList.add('was-validated');
	}
});

/* ---------- Logout ---------- */

// Handle Logout
logoutLink?.addEventListener('click', async event => {
	// Prevent Default
	event.preventDefault();

	// Emit Request
	await fetch('/api/auth');

	// Reload
	history.go();
});
