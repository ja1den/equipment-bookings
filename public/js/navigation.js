// Locate Toggle Element
const darkToggle = document.querySelector('[aria-label="Toggle Theme"]');

/**
 * Handle the 'onclick' event.
 */
darkToggle.onclick = event => {
	// Prevent Default
	event.preventDefault();

	// Read Inverted State
	isDark = !document.cookie.split(';').some(cookie => cookie.trim().startsWith('isDark='));

	// Set Cookie
	document.cookie = isDark
		? 'isDark=; expires=Fri, 31 Dec 10000 23:59:59 GMT'
		: 'isDark=; expires=Thu, 01 Jan 01970 00:00:00 GMT';

	// Toggle 'theme-dark'
	document.body.classList.toggle('theme-dark', isDark);
}
