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

window.Api = {
    fetchStatus,
    switchPull,
};
