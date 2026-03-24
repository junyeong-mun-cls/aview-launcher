const fs = require("fs");
const path = require("path");
const { spawn, exec } = require("child_process");
const { getRepoRoot } = require("./gitService");

const runtimeDir = path.join(__dirname, "..", "..", "runtime");
const appLogPath = path.join(runtimeDir, "app.log");

let appProcess = null;

function ensureRuntimeDir() {
    if (!fs.existsSync(runtimeDir)) {
        fs.mkdirSync(runtimeDir, { recursive: true });
    }
}

function getAppLogPath() {
    ensureRuntimeDir();
    return appLogPath;
}

function readAppLogs() {
    const logPath = getAppLogPath();

    if (!fs.existsSync(logPath)) {
        return "";
    }

    return fs.readFileSync(logPath, "utf8");
}

function clearAppLogs() {
    const logPath = getAppLogPath();
    if (fs.existsSync(logPath)) {
        fs.writeFileSync(logPath, "");
    }
}

function getBinPath() {
    return path.join(getRepoRoot(), "build", "bin");
}

function getAppStatus() {
    if (!appProcess) {
        return "stopped";
    }

    try {
        process.kill(appProcess.pid, 0);
        return "running";
    } catch {
        appProcess = null;
        return "stopped";
    }
}

function isAppRunning() {
    return getAppStatus() === "running";
}

function startApp() {
    if (isAppRunning()) {
        return {
            ok: false,
            message: "App is already running.",
        };
    }

    const binPath = getBinPath();

    if (!fs.existsSync(binPath)) {
        return {
            ok: false,
            message: `Bin directory does not exist: ${binPath}`,
        };
    }

    ensureRuntimeDir();
    clearAppLogs();

    const logFd = fs.openSync(getAppLogPath(), "a");

    const child = spawn("./runapp.sh", ["aview.platform.exe"], {
        cwd: binPath,
        detached: true,
        stdio: ["ignore", logFd, logFd],
        shell: false,
    });

    child.unref();
    appProcess = child;

    return {
        ok: true,
        message: "App started.",
        pid: child.pid,
    };
}

function stopApp() {
    if (!appProcess || !isAppRunning()) {
        appProcess = null;

        return {
            ok: false,
            message: "App is not running.",
        };
    }

    try {
        process.kill(-appProcess.pid, "SIGTERM");
        appProcess = null;

        return {
            ok: true,
            message: "App stopped.",
        };
    } catch (error) {
        return {
            ok: false,
            message: "Failed to stop app.",
            error: error.message,
        };
    }
}

function forceStopApp() {
    return new Promise((resolve) => {
        exec(
            "ps -A | grep aview | awk '{print $1}' | xargs kill",
            (error, stdout, stderr) => {
                // 어쨌든 다 죽이는게 목적이라 상태는 stopped로 정리
                appProcess = null;

                return resolve({
                    ok: true,
                    message: "Force stop executed.",
                    stdout,
                    stderr,
                });
            },
        );
    });
}

module.exports = {
    startApp,
    stopApp,
    isAppRunning,
    getAppStatus,
    readAppLogs,
    forceStopApp,
};
