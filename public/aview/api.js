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

const defaultApiUrl = "/aview/api";

async function fetchStatus() {
    return requestJson(`${defaultApiUrl}/status`);
}

async function switchPull(branch) {
    return requestJson(`${defaultApiUrl}/switch-pull`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ branch }),
    });
}

async function startBuild() {
    return requestJson(`${defaultApiUrl}/build/start`, {
        method: "POST",
    });
}

async function fetchBuildLogs() {
    return requestJson(`${defaultApiUrl}/build/logs`);
}

async function startApp() {
    return requestJson(`${defaultApiUrl}/app/start`, {
        method: "POST",
    });
}

async function stopApp() {
    return requestJson(`${defaultApiUrl}/app/stop`, {
        method: "POST",
    });
}

async function fetchAppStatus() {
    return requestJson(`${defaultApiUrl}/app/status`);
}

async function fetchAppLogs() {
    return requestJson(`${defaultApiUrl}/app/logs`);
}

async function forceStopApp() {
    return requestJson(`${defaultApiUrl}/app/force-stop`, {
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
