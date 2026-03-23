// 로그 출력, 자동 스크롤, 최대 줄 수 제한

const logBox = document.getElementById("log-box");

function log(message) {
    if (!logBox) return;

    const now = new Date().toLocaleTimeString();
    logBox.textContent += `\n[${now}] ${message}`;

    const lines = logBox.textContent.split("\n");
    if (lines.length > 200) {
        logBox.textContent = lines.slice(-200).join("\n");
    }

    logBox.scrollTop = logBox.scrollHeight;
}

function clearLog() {
    if (!logBox) return;
    logBox.textContent = "";
}

window.Logger = {
    log,
    clearLog,
};
