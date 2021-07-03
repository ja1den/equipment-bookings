/* ---------- Login ---------- */

// Locate Element
const loginModal = document.getElementById('login-modal');
const loginForm = document.getElementById('login-form');

// Handle Modal
if (loginModal !== null) {
	loginModal.addEventListener('show.bs.modal', () => {
		// Reset Styles
		resetFormStyles();

		// Reset Inputs
		loginForm.reset();
	});
}

// Handle Login
if (loginForm !== null) {
	loginForm.onsubmit = async event => {
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
			const response = await fetch('/api/login', {
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
	}
}

// Reset Form Styles
function resetFormStyles() {
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

/* ---------- Logout ---------- */

// Locate Element
const logoutLink = document.getElementById('logout-link');

// Handle Logout
if (logoutLink !== null) {
	logoutLink.onclick = async event => {
		// Prevent Default
		event.preventDefault();

		// Emit Request
		await fetch('/api/logout');

		// Reload
		history.go();
	}
}
