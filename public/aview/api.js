// fetch 호출

async function requestJson(url, options = {}) {
    const response = await fetch(url, options);
    const result = await response.json();

    return {
        ok: response.ok,
        status: response.status,
        data: result,
    };
}

async function fetchStatus() {
    return requestJson("/api/status");
}

async function switchPull(branch) {
    return requestJson("/api/switch-pull", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ branch }),
    });
}

async function startBuild() {
    return requestJson("/api/build/start", {
        method: "POST",
    });
}

async function fetchBuildLogs() {
    return requestJson("/api/build/logs");
}

async function startApp() {
    return requestJson("/api/app/start", {
        method: "POST",
    });
}

async function stopApp() {
    return requestJson("/api/app/stop", {
        method: "POST",
    });
}

async function fetchAppStatus() {
    return requestJson("/api/app/status");
}

async function fetchAppLogs() {
    return requestJson("/api/app/logs");
}

async function forceStopApp() {
    return requestJson("/api/app/force-stop", {
        method: "POST",
    });
}

window.Api = {
    fetchStatus,
    switchPull,
    startBuild,
    fetchBuildLogs,
    startApp,
    stopApp,
    fetchAppStatus,
    fetchAppLogs,
    forceStopApp,
};
