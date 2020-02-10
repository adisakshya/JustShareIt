/**
 * Event ListenerL Load
 * when the window loads complete, hide the loader (after 3.5 seconds)
 */
window.addEventListener("load", async function () {
    await new Promise(r => setTimeout(r, 3500));
    const loader = document.querySelector(".loader");
    loader.className += " hidden";
});