let buildLogIntervalId = null;
let appLogIntervalId = null;

function getBranchInputValue() {
    const branchInput = document.getElementById("branch");
    return branchInput ? branchInput.value.trim() : "";
}

function getBuildButton() {
    return document.getElementById("build-btn");
}

function getStartButton() {
    return document.getElementById("hub-start-btn");
}

function getStopButton() {
    return document.getElementById("hub-stop-btn");
}

function setBuildButtonDisabled(disabled) {
    const buildBtn = getBuildButton();
    if (buildBtn) {
        buildBtn.disabled = disabled;
    }
}

function setStartButtonDisabled(disabled) {
    const startBtn = getStartButton();
    if (startBtn) {
        startBtn.disabled = disabled;
    }
}

function setStopButtonDisabled(disabled) {
    const stopBtn = getStopButton();
    if (stopBtn) {
        stopBtn.disabled = disabled;
    }
}

function appendActionLog(message) {
    const box = document.getElementById("action-log-box");
    if (!box) return;

    const currentText =
        box.textContent && box.textContent !== "Ready."
            ? `${box.textContent}\n`
            : "";

    const time = new Date().toLocaleTimeString();
    box.textContent = `${currentText}[${time}] ${message}`;
    box.scrollTop = box.scrollHeight;
}

function setActionLog(logs) {
    const box = document.getElementById("action-log-box");
    if (!box) return;

    box.textContent = logs && logs.trim() ? logs : "Ready.";
    box.scrollTop = box.scrollHeight;
}

function clearActionLog() {
    const box = document.getElementById("action-log-box");
    if (!box) return;

    box.textContent = "Ready.";
}

function setAppLog(logs) {
    const box = document.getElementById("app-log-box");
    if (!box) return;

    box.textContent = logs || "";
    box.scrollTop = box.scrollHeight;
}

function clearAppLog() {
    const box = document.getElementById("app-log-box");
    if (!box) return;

    box.textContent = "";
}

function setBuildLog(logs) {
    const box = document.getElementById("build-log-box");
    if (!box) return;

    box.textContent = logs || "";
    box.scrollTop = box.scrollHeight;
}

function clearBuildLog() {
    const box = document.getElementById("build-log-box");
    if (!box) return;

    box.textContent = "";
}

function setCurrentBranch(branch) {
    const el = document.getElementById("current-branch");
    if (el && branch) {
        el.textContent = branch;
    }
}

function setBuildStatus(buildStatus) {
    const el = document.getElementById("build-status");
    if (el && buildStatus) {
        el.textContent = buildStatus;
    }
}

function updateButtonsByStatus(status) {
    const isBuilding = status.buildStatus === "building";
    const isRunning = status.runningTarget === "hub";

    setBuildButtonDisabled(isBuilding);
    setStartButtonDisabled(isRunning);
    setStopButtonDisabled(!isRunning);
}

async function refreshStatus() {
    try {
        const result = await getStatus();

        if (!result.ok) {
            return;
        }

        setCurrentBranch(result.currentBranch);
        setBuildStatus(result.buildStatus);
        updateButtonsByStatus(result);

        if (result.runningTarget !== "hub") {
            stopAppLogPolling();
        }
    } catch (error) {
        appendActionLog(`Status request error: ${error.message}`);
    }
}

async function refreshBuildLogs() {
    try {
        const result = await getBuildLogs();

        if (!result.ok) {
            appendActionLog(
                `Failed to fetch build logs: ${result.message || "Unknown error"}`,
            );
            return;
        }

        setBuildLog(result.logs);
    } catch (error) {
        appendActionLog(`Build logs request error: ${error.message}`);
    }
}

async function refreshActionLogs() {
    try {
        const result = await getActionLogs();

        if (!result.ok) {
            appendActionLog(
                `Failed to fetch action logs: ${result.message || "Unknown error"}`,
            );
            return;
        }

        setActionLog(result.logs);
        updateButtonsByStatus({
            buildStatus: document.getElementById("build-status")?.textContent,
            runningTarget: result.runningTarget,
        });
    } catch (error) {
        appendActionLog(`Action logs request error: ${error.message}`);
    }
}

async function refreshAppLogs() {
    try {
        const result = await getAppLogs();

        if (!result.ok) {
            appendActionLog(
                `Failed to fetch app logs: ${result.message || "Unknown error"}`,
            );
            return;
        }

        setAppLog(result.logs);
    } catch (error) {
        appendActionLog(`App logs request error: ${error.message}`);
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

function startAppLogPolling() {
    stopAppLogPolling();

    appLogIntervalId = setInterval(async () => {
        await refreshAppLogs();
    }, 1000);
}

function stopAppLogPolling() {
    if (appLogIntervalId) {
        clearInterval(appLogIntervalId);
        appLogIntervalId = null;
    }
}

async function handleSwitchPullClick() {
    const branch = getBranchInputValue();

    if (!branch) {
        appendActionLog("Please enter a branch name.");
        return;
    }

    appendActionLog(`Fetch → Switch → Pull started. branch="${branch}"`);

    try {
        const result = await switchAndPull(branch);

        if (!result.ok) {
            appendActionLog(`Failed: ${result.message || "Unknown error"}`);

            if (result.stderr) {
                appendActionLog(`stderr:\n${result.stderr}`);
            }

            if (result.stdout) {
                appendActionLog(`stdout:\n${result.stdout}`);
            }

            if (result.fetch?.stdout) {
                appendActionLog(`fetch stdout:\n${result.fetch.stdout}`);
            }

            if (result.fetch?.stderr) {
                appendActionLog(`fetch stderr:\n${result.fetch.stderr}`);
            }

            if (result.switch?.stdout) {
                appendActionLog(`switch stdout:\n${result.switch.stdout}`);
            }

            if (result.switch?.stderr) {
                appendActionLog(`switch stderr:\n${result.switch.stderr}`);
            }

            if (result.pull?.stdout) {
                appendActionLog(`pull stdout:\n${result.pull.stdout}`);
            }

            if (result.pull?.stderr) {
                appendActionLog(`pull stderr:\n${result.pull.stderr}`);
            }

            return;
        }

        appendActionLog(result.message);

        if (result.fetch?.stdout) {
            appendActionLog(`fetch stdout:\n${result.fetch.stdout}`);
        }

        if (result.fetch?.stderr) {
            appendActionLog(`fetch stderr:\n${result.fetch.stderr}`);
        }

        if (result.switch?.stdout) {
            appendActionLog(`switch stdout:\n${result.switch.stdout}`);
        }

        if (result.switch?.stderr) {
            appendActionLog(`switch stderr:\n${result.switch.stderr}`);
        }

        if (result.pull?.stdout) {
            appendActionLog(`pull stdout:\n${result.pull.stdout}`);
        }

        if (result.pull?.stderr) {
            appendActionLog(`pull stderr:\n${result.pull.stderr}`);
        }

        await refreshStatus();
    } catch (error) {
        appendActionLog(`Request error: ${error.message}`);
    }
}

async function handleBuildClick() {
    const buildBtn = getBuildButton();

    if (buildBtn?.disabled) {
        return;
    }

    appendActionLog("Build start requested.");
    clearBuildLog();

    try {
        const result = await startBuild();

        if (!result.ok) {
            appendActionLog(
                `Build start failed: ${result.message || "Unknown error"}`,
            );
            return;
        }

        appendActionLog(result.message);

        await refreshStatus();
        await refreshBuildLogs();
        startBuildLogPolling();
    } catch (error) {
        appendActionLog(`Build request error: ${error.message}`);
    }
}

async function handleStartClick() {
    appendActionLog("App start requested.");
    clearAppLog();

    try {
        const result = await startHub();

        if (!result.ok) {
            appendActionLog(
                `App start failed: ${result.message || "Unknown error"}`,
            );
            return;
        }

        appendActionLog(result.message);

        await refreshStatus();
        await refreshActionLogs();
        await refreshAppLogs();
        startAppLogPolling();
    } catch (error) {
        appendActionLog(`App start error: ${error.message}`);
    }
}

async function handleStopClick() {
    appendActionLog("App stop requested.");

    try {
        const result = await stopHub();

        if (!result.ok) {
            appendActionLog(
                `App stop failed: ${result.message || "Unknown error"}`,
            );
            return;
        }

        appendActionLog(result.message);

        stopAppLogPolling();
        await refreshStatus();
        await refreshActionLogs();
        await refreshAppLogs();
    } catch (error) {
        appendActionLog(`App stop error: ${error.message}`);
    }
}

function bindEvents() {
    document
        .getElementById("switch-pull-btn")
        ?.addEventListener("click", handleSwitchPullClick);

    document
        .getElementById("build-btn")
        ?.addEventListener("click", handleBuildClick);

    document
        .getElementById("hub-start-btn")
        ?.addEventListener("click", handleStartClick);

    document
        .getElementById("hub-stop-btn")
        ?.addEventListener("click", handleStopClick);

    document
        .getElementById("clear-action-log-btn")
        ?.addEventListener("click", clearActionLog);
}

async function init() {
    bindEvents();

    await refreshStatus();
    await refreshActionLogs();
    await refreshBuildLogs();
    await refreshAppLogs();

    const status = await getStatus();

    if (status.ok && status.buildStatus === "building") {
        startBuildLogPolling();
    }

    if (status.ok && status.runningTarget === "hub") {
        startAppLogPolling();
    }
}

init();
