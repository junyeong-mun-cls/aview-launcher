// 버튼 이벤트 연결, 초기화

function getBranchInputValue() {
    const branchInput = document.getElementById("branch");
    return branchInput ? branchInput.value.trim() : "";
}

async function handleSwitchPullClick() {
    const branch = getBranchInputValue();

    if (!branch) {
        window.Logger.log("Please enter a branch name.");
        return;
    }

    window.Logger.log(`Switch & Pull started. branch="${branch}"`);

    try {
        const result = await window.Api.switchPull(branch);

        if (!result.ok || !result.data.ok) {
            window.Logger.log(
                `Failed: ${result.data.message || "Unknown error"}`,
            );

            if (result.data.stderr) {
                window.Logger.log(`stderr:\n${result.data.stderr}`);
            }

            if (result.data.stdout) {
                window.Logger.log(`stdout:\n${result.data.stdout}`);
            }

            return;
        }

        window.Logger.log(result.data.message);

        if (result.data.switch?.stdout) {
            window.Logger.log(`switch stdout:\n${result.data.switch.stdout}`);
        }

        if (result.data.switch?.stderr) {
            window.Logger.log(`switch stderr:\n${result.data.switch.stderr}`);
        }

        if (result.data.pull?.stdout) {
            window.Logger.log(`pull stdout:\n${result.data.pull.stdout}`);
        }

        if (result.data.pull?.stderr) {
            window.Logger.log(`pull stderr:\n${result.data.pull.stderr}`);
        }

        await window.Status.refreshStatus();
    } catch (error) {
        window.Logger.log(`Request error: ${error.message}`);
    }
}

function handleBuildClick() {
    window.Logger.log("Build clicked.");
}

function handleStartClick() {
    window.Logger.log("Start clicked.");
}

function handleStopClick() {
    window.Logger.log("Stop clicked.");
}

function bindEvents() {
    document
        .getElementById("switch-pull-btn")
        ?.addEventListener("click", handleSwitchPullClick);
    document
        .getElementById("build-btn")
        ?.addEventListener("click", handleBuildClick);
    document
        .getElementById("start-btn")
        ?.addEventListener("click", handleStartClick);
    document
        .getElementById("stop-btn")
        ?.addEventListener("click", handleStopClick);
    document
        .getElementById("clear-log-btn")
        ?.addEventListener("click", window.Logger.clearLog);
}

function init() {
    bindEvents();
    window.Status.refreshStatus();
    setInterval(window.Status.refreshStatus, 5000);
}

init();
