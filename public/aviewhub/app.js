function appendActionLog(message) {
    const box = document.getElementById("action-log-box");
    if (!box) return;

    const time = new Date().toLocaleTimeString();
    box.textContent += `\n[${time}] ${message}`;
    box.scrollTop = box.scrollHeight;
}

function setBuildLog(logs) {
    const box = document.getElementById("build-log-box");
    if (!box) return;
    box.textContent = logs || "";
}

document
    .getElementById("clear-action-log-btn")
    ?.addEventListener("click", () => {
        const box = document.getElementById("action-log-box");
        if (box) {
            box.textContent = "Ready.";
        }
    });

document
    .getElementById("switch-pull-btn")
    ?.addEventListener("click", async () => {
        const branch = document.getElementById("branch")?.value.trim();

        const result = await switchAndPull(branch);
        appendActionLog(result.message || JSON.stringify(result));

        if (result.branch) {
            const branchEl = document.getElementById("current-branch");
            if (branchEl) {
                branchEl.textContent = result.branch;
            }
        }
    });

document.getElementById("build-btn")?.addEventListener("click", async () => {
    const result = await startBuild();
    appendActionLog(result.message || JSON.stringify(result));

    const logs = await getBuildLogs();
    setBuildLog(logs.logs);
});

document
    .getElementById("hub-start-btn")
    ?.addEventListener("click", async () => {
        const result = await startHub();
        appendActionLog(result.message || JSON.stringify(result));
    });

document.getElementById("hub-stop-btn")?.addEventListener("click", async () => {
    const result = await stopHub();
    appendActionLog(result.message || JSON.stringify(result));
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
        appendActionLog(result.message || JSON.stringify(result));
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
        appendActionLog(result.message || JSON.stringify(result));
    });
