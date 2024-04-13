/**
 * Asynchronously includes HTML content from external files into elements
 * with the 'w3-include-html' attribute.
 * @returns {Promise<void>} A promise that resolves once HTML content
 * is included into all elements.
 */
async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        let file = includeElements[i].getAttribute("w3-include-html"); 
        let resp = await fetch(file);
        if (resp.ok) {
            includeElements[i].innerHTML = await resp.text();
        }
        else {
            includeElements[i].innerHTML = 'Page not found';
        }
    }
}
