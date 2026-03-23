const logBox = document.getElementById('log-box');

function log(message) {
    const now = new Date().toLocaleTimeString();
    logBox.textContent += `\n[${now}] ${message}`;
}

document.getElementById('switch-pull-btn').addEventListener('click', () => {
    const branch = document.getElementById('branch').value.trim();
    log(`Switch & Pull clicked. branch="${branch}"`);
});

document.getElementById('build-btn').addEventListener('click', () => {
    log('Build clicked.');
});

document.getElementById('start-btn').addEventListener('click', () => {
    log('Start clicked.');
});

document.getElementById('stop-btn').addEventListener('click', () => {
    log('Stop clicked.');
});