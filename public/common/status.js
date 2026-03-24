// 상태 UI 업데이트, 상태 새로고침

function updateStatusUI(status) {
    const currentBranchEl = document.getElementById("current-branch");
    const buildStatusEl = document.getElementById("build-status");
    const appStatusEl = document.getElementById("app-status");
    const appUrlEl = document.getElementById("app-url");

    if (currentBranchEl) {
        currentBranchEl.textContent = status.currentBranch || "unknown";
    }

    if (buildStatusEl) {
        buildStatusEl.textContent = status.buildStatus || "idle";
    }

    if (appStatusEl) {
        appStatusEl.textContent = status.appStatus || "stopped";
    }

    if (appUrlEl && status.appUrl) {
        appUrlEl.textContent = status.appUrl;
        appUrlEl.href = status.appUrl;
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

        updateStatusUI(result.data);
    } catch (error) {
        window.Logger.log(`Status request error: ${error.message}`);
    }
}

window.Status = {
    updateStatusUI,
    refreshStatus,
};
