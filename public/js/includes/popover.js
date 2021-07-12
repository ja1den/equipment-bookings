// Locate Elements
const popovers = document.querySelectorAll('[data-bs-toggle="popover"]');

// Iterate
[...popovers].forEach(popover => new bootstrap.Popover(popover));
