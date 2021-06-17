// Locate Elements
const darkToggle = document.querySelector('[aria-label="Toggle Theme"]');
const imageElement = darkToggle.querySelector('div');

// Initial Theme
if (document.cookie === '' && window.matchMedia('(prefers-color-scheme: dark)').matches || document.cookie === 'dark=true') {
	// Set Image
	imageElement.style.setProperty('--image-url', 'url(/images/sun.svg)');

	// Set Theme
	document.body.classList.add('theme-dark');
}

// Bind 'onclick'
darkToggle.onclick = (event) => {
	// Ignore Default
	event.preventDefault();

	// Current Theme
	const isDark = document.body.classList.contains('theme-dark');

	// Set Image
	imageElement.style.setProperty('--image-url', isDark ? 'url(/images/sun-off.svg)' : 'url(/images/sun.svg)');

	// Set Theme
	document.body.classList.toggle('theme-dark', !isDark);

	// Set Cookie
	document.cookie = 'dark=' + !isDark + '; expires=Fri, 31 Dec 10000 23:59:59 GMT';
}
