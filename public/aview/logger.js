// 로그 출력, 자동 스크롤, 최대 줄 수 제한
const actionLogBox = document.getElementById("action-log-box");

function log(message) {
    if (!actionLogBox) return;

    const now = new Date().toLocaleTimeString();
    actionLogBox.textContent += `\n[${now}] ${message}`;

    const lines = actionLogBox.textContent.split("\n");
    if (lines.length > 200) {
        actionLogBox.textContent = lines.slice(-200).join("\n");
    }

    actionLogBox.scrollTop = actionLogBox.scrollHeight;
}

function clearLog() {
    if (!actionLogBox) return;
    actionLogBox.textContent = "";
}

window.Logger = {
    log,
    clearLog,
};
