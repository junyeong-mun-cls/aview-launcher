// server mounts: app.use("/aviewhub/api", aviewhubRoutes)
const AVIEWHUB_API_BASE = "/aviewhub/api";

async function getStatus() {
    const response = await fetch(`${AVIEWHUB_API_BASE}/status`);
    return response.json();
}

async function switchAndPull(branch) {
    const response = await fetch(`${AVIEWHUB_API_BASE}/switch-pull`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ branch }),
    });

    return response.json();
}

async function startBuild() {
    const response = await fetch(`${AVIEWHUB_API_BASE}/build/start`, {
        method: "POST",
    });

    return response.json();
}

async function getBuildLogs() {
    const response = await fetch(`${AVIEWHUB_API_BASE}/build/logs`);
    return response.json();
}

async function getActionLogs() {
    const response = await fetch(`${AVIEWHUB_API_BASE}/action-logs`);
    return response.json();
}

async function startHub() {
    const response = await fetch(`${AVIEWHUB_API_BASE}/hub/start`, {
        method: "POST",
    });

    return response.json();
}

async function stopHub() {
    const response = await fetch(`${AVIEWHUB_API_BASE}/hub/stop`, {
        method: "POST",
    });

    return response.json();
}

async function startDeepC(inputDir, outputDir) {
    const response = await fetch(`${AVIEWHUB_API_BASE}/deepc/start`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputDir, outputDir }),
    });

    return response.json();
}

async function startFloy(inputDir, outputDir) {
    const response = await fetch(`${AVIEWHUB_API_BASE}/floy/start`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputDir, outputDir }),
    });

    return response.json();
}
