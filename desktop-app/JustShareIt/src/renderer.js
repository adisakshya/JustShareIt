/**
 * This file is required by the index page html file and
 * will be executed in the renderer process for that window,
 * all of NodeJS api's are available in this process
 */

const remote = require('electron').remote;

/* Initialize when the document has loaded */
document.onreadystatechange = () => {
    if(document.readyState === 'complete') {
        handleWindowControls();
    }
};

/**
 * Function handleWindowControls
 */
function handleWindowControls() {

    let window = remote.getCurrentWindow();

    /**
     * Minimize/Maximize/Restore/Close buttons work
     * when they are clicked
     */

    document.getElementById('min-button').addEventListener('click', event => {
        window.minimize();
    });

    document.getElementById('max-button').addEventListener('click', event => {
        window.maximize();
    });

    document.getElementById('restore-button').addEventListener('click', event => {
        window.unmaximize();
    });

    document.getElementById('close-button').addEventListener('click', event => {
        window.close();
    });

    /**
     * Toggle maximize/restore buttons
     * when maximization/unmaximization occurs
     */
    toggleMaxRestoreButtons();
    window.on('maximize', toggleMaxRestoreButtons);
    window.on('unmaximize', toggleMaxRestoreButtons);

    function toggleMaxRestoreButtons() {
        if(window.isMaximized()) {
            document.body.classList.add('maximized');
        } else {
            document.body.classList.remove('maximized');
        }
    }

}
