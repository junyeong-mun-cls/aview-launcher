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
    const deepcStartBtn = document.getElementById("deepc-start-btn");
    const floyStartBtn = document.getElementById("floy-start-btn");

    if (!runningTarget) {
        if (hubStartBtn) hubStartBtn.disabled = false;
        if (deepcStartBtn) deepcStartBtn.disabled = false;
        if (floyStartBtn) floyStartBtn.disabled = false;
        if (hubStopBtn) hubStopBtn.disabled = true;
        return;
    }

    if (hubStartBtn) hubStartBtn.disabled = runningTarget !== "hub";
    if (deepcStartBtn) deepcStartBtn.disabled = runningTarget !== "deepc";
    if (floyStartBtn) floyStartBtn.disabled = runningTarget !== "floy";
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

        if (!result.ok) {
            setActionLog(result.message || "Failed to start hub.");
        }
    });

document.getElementById("hub-stop-btn")?.addEventListener("click", async () => {
    const result = await stopHub();
    await refreshActionLogs();

    if (!result.ok) {
        setActionLog(result.message || "Failed to stop hub.");
    }
});

document
    .getElementById("deepc-start-btn")
    ?.addEventListener("click", async () => {
        const inputDir = document
            .getElementById("deepc-input-dir")
            ?.value.trim();
        const outputDir = document
            .getElementById("deepc-output-dir")
            ?.value.trim();

        const result = await startDeepC(inputDir, outputDir);
        await refreshActionLogs();

        if (!result.ok) {
            setActionLog(result.message || "Failed to start deepc.");
        }
    });

document
    .getElementById("floy-start-btn")
    ?.addEventListener("click", async () => {
        const inputDir = document
            .getElementById("floy-input-dir")
            ?.value.trim();
        const outputDir = document
            .getElementById("floy-output-dir")
            ?.value.trim();

        const result = await startFloy(inputDir, outputDir);
        await refreshActionLogs();

        if (!result.ok) {
            setActionLog(result.message || "Failed to start floy.");
        }
    });

window.addEventListener("load", async () => {
    await refreshStatus();
    await refreshActionLogs();
});
