const appLogBox = document.getElementById("app-log-box");

function setAppLogText(text) {
    if (!appLogBox) return;

    appLogBox.textContent = text || "";
    appLogBox.scrollTop = appLogBox.scrollHeight;
}

function clearAppLog() {
    if (!appLogBox) return;
    appLogBox.textContent = "";
}

window.AppLogger = {
    setText: setAppLogText,
    clear: clearAppLog,
};
