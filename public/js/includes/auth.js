/* ----- Locate Elements ----- */

// Login
const loginForm = document.getElementById('login-form');

/* ----- Login ----- */

// Handle Submit
loginForm?.addEventListener('submit', async event => {
	// Prevent Default
	event.preventDefault();

	// Check Form
	if (loginForm.checkValidity()) {
		// Read Data
		const data = Object.fromEntries(new FormData(loginForm).entries());

		// Emit Request
		const response = await fetch('/api/auth/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data)
		});

		// Error?
		if (response.status === 401) return loginForm.showErrorMessage();
		if (response.status !== 200) return;

		// Reload
		history.go();
	} else {
		// Show Input Errors
		loginForm.showInputErrors();
	}
});

/* ----- Logout ----- */

// Handle Click
document.getElementById('logout-link')?.addEventListener('click', async event => {
	// Prevent Default
	event.preventDefault();

	// Emit Request
	await fetch('/api/auth/logout', { method: 'GET' });

	// Reload
	history.go();
});
