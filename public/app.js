let buildLogIntervalId = null;
let statusWatchIntervalId = null;

function getBranchInputValue() {
    const branchInput = document.getElementById("branch");
    return branchInput ? branchInput.value.trim() : "";
}

function getBuildButton() {
    return document.getElementById("build-btn");
}

function setBuildButtonDisabled(disabled) {
    const buildBtn = getBuildButton();
    if (buildBtn) {
        buildBtn.disabled = disabled;
    }
}

function updateButtonsByStatus(status) {
    const isBuilding = status.buildStatus === "building";
    setBuildButtonDisabled(isBuilding);
}

async function refreshBuildLogs() {
    try {
        const result = await window.Api.fetchBuildLogs();

        if (!result.ok || !result.data.ok) {
            window.Logger.log(
                `Failed to fetch build logs: ${result.data.message || "Unknown error"}`,
            );
            return;
        }

        window.BuildLogger.setText(result.data.logs);
    } catch (error) {
        window.Logger.log(`Build logs request error: ${error.message}`);
    }
}

function startBuildLogPolling() {
    stopBuildLogPolling();

    buildLogIntervalId = setInterval(async () => {
        await refreshBuildLogs();
    }, 1000);
}

function stopBuildLogPolling() {
    if (buildLogIntervalId) {
        clearInterval(buildLogIntervalId);
        buildLogIntervalId = null;
    }
}

async function refreshStatus() {
    try {
        const result = await window.Api.fetchStatus();

        if (!result.ok || !result.data.ok) {
            window.Logger.log(
                `Failed to refresh status: ${result.data.message || "Unknown error"}`,
            );
            return;
        }

        window.Status.updateStatusUI(result.data);
        updateButtonsByStatus(result.data);

        if (result.data.buildStatus !== "building") {
            stopBuildLogPolling();
        }
    } catch (error) {
        window.Logger.log(`Status request error: ${error.message}`);
    }
}

function startStatusWatch() {
    stopStatusWatch();

    statusWatchIntervalId = setInterval(async () => {
        await refreshStatus();
    }, 1000);
}

function stopStatusWatch() {
    if (statusWatchIntervalId) {
        clearInterval(statusWatchIntervalId);
        statusWatchIntervalId = null;
    }
}

async function handleSwitchPullClick() {
    const branch = getBranchInputValue();

    if (!branch) {
        window.Logger.log("Please enter a branch name.");
        return;
    }

    window.Logger.log(`Fetch → Switch → Pull started. branch="${branch}"`);

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

        if (result.data.fetch?.stdout) {
            window.Logger.log(`fetch stdout:\n${result.data.fetch.stdout}`);
        }

        if (result.data.fetch?.stderr) {
            window.Logger.log(`fetch stderr:\n${result.data.fetch.stderr}`);
        }

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

        await refreshStatus();
    } catch (error) {
        window.Logger.log(`Request error: ${error.message}`);
    }
}

async function handleBuildClick() {
    const buildBtn = getBuildButton();

    if (buildBtn?.disabled) {
        return;
    }

    window.Logger.log("Build start requested.");
    window.BuildLogger.clear();

    try {
        const result = await window.Api.startBuild();

        if (!result.ok || !result.data.ok) {
            window.Logger.log(
                `Build start failed: ${result.data.message || "Unknown error"}`,
            );
            return;
        }

        window.Logger.log(result.data.message);

        await refreshStatus();
        await refreshBuildLogs();
        startBuildLogPolling();
    } catch (error) {
        window.Logger.log(`Build request error: ${error.message}`);
    }
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
        .getElementById("clear-action-log-btn")
        ?.addEventListener("click", () => {
            window.Logger.clearLog();
        });

    document
        .getElementById("clear-build-log-btn")
        ?.addEventListener("click", () => {
            window.BuildLogger.clear();
        });
}

async function init() {
    bindEvents();
    await refreshStatus();
    await refreshBuildLogs();
    startStatusWatch();
}

init();
