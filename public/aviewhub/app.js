function setActionLog(logs) {
    const box = document.getElementById("action-log-box");
    if (!box) return;

    box.textContent = logs && logs.trim() ? logs : "Ready.";
    box.scrollTop = box.scrollHeight;
}

function setBuildLog(logs) {
    const box = document.getElementById("build-log-box");
    if (!box) return;

    box.textContent = logs || "";
    box.scrollTop = box.scrollHeight;
}

function setCurrentBranch(branch) {
    const el = document.getElementById("current-branch");
    if (el && branch) {
        el.textContent = branch;
    }
}

function updateStartButtons(runningTarget) {
    const hubStartBtn = document.getElementById("hub-start-btn");
    const hubStopBtn = document.getElementById("hub-stop-btn");

    if (!runningTarget) {
        if (hubStartBtn) hubStartBtn.disabled = false;
        if (hubStopBtn) hubStopBtn.disabled = true;
        return;
    }

    if (hubStartBtn) hubStartBtn.disabled = runningTarget !== "hub";
    if (hubStopBtn) hubStopBtn.disabled = runningTarget !== "hub";
}

async function refreshStatus() {
    const result = await getStatus();

    if (!result.ok) {
        return;
    }

    setCurrentBranch(result.currentBranch);
    updateStartButtons(result.runningTarget);
}

async function refreshActionLogs() {
    const result = await getActionLogs();

    if (!result.ok) {
        return;
    }

    setActionLog(result.logs);
    updateStartButtons(result.runningTarget);
}

async function refreshAppLogs() {
    const result = await getAppLogs();
    if (result.ok) {
        setAppLog(result.logs);
    }
}

function setAppLog(logs) {
    const box = document.getElementById("app-log-box");
    if (!box) return;
    box.textContent = logs || "";
}

document
    .getElementById("clear-action-log-btn")
    ?.addEventListener("click", () => {
        setActionLog("Ready.");
    });

document
    .getElementById("switch-pull-btn")
    ?.addEventListener("click", async () => {
        const branch = document.getElementById("branch")?.value.trim();
        const result = await switchAndPull(branch);

        setActionLog(result.message || "Switch & Pull finished.");

        if (result.ok && result.branch) {
            setCurrentBranch(result.branch);
        }
    });

document.getElementById("build-btn")?.addEventListener("click", async () => {
    const result = await startBuild();
    setActionLog(result.message || "Build started.");

    const buildLogResult = await getBuildLogs();
    if (buildLogResult.ok) {
        setBuildLog(buildLogResult.logs);
    }
});

document
    .getElementById("hub-start-btn")
    ?.addEventListener("click", async () => {
        const result = await startHub();
        await refreshActionLogs();
        await refreshAppLogs();

        if (!result.ok) {
            setActionLog(result.message || "Failed to start hub.");
        }
    });

document.getElementById("hub-stop-btn")?.addEventListener("click", async () => {
    const result = await stopHub();
    await refreshActionLogs();
    await refreshAppLogs();

    if (!result.ok) {
        setActionLog(result.message || "Failed to stop hub.");
    }
});

window.addEventListener("load", async () => {
    await refreshStatus();
    await refreshActionLogs();
    await refreshAppLogs();
});
