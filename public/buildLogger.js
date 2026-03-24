const buildLogBox = document.getElementById("build-log-box");

function setBuildLogText(text) {
    if (!buildLogBox) return;

    buildLogBox.textContent = text || "";
    buildLogBox.scrollTop = buildLogBox.scrollHeight;
}

function clearBuildLog() {
    if (!buildLogBox) return;
    buildLogBox.textContent = "";
}

window.BuildLogger = {
    setText: setBuildLogText,
    clear: clearBuildLog,
};
