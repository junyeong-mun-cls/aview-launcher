const fs = require("fs");
const path = require("path");
const { spawn, exec } = require("child_process");

const filePath = require("../utils/filepath");

let appProcess = null;

function ReadAppLogs() {
    const logPath = filePath.GetAppLogPath();

    if (!fs.existsSync(logPath)) {
        return "";
    }

    return fs.readFileSync(logPath, "utf8");
}

function GetAppStatus() {
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

function IsAppRunning() {
    return GetAppStatus() === "running";
}

function StartApp() {
    if (IsAppRunning()) {
        return {
            ok: false,
            message: "App is already running.",
        };
    }

    const binPath = filePath.GetBinPath();

    if (!fs.existsSync(binPath)) {
        return {
            ok: false,
            message: `Bin directory does not exist: ${binPath}`,
        };
    }

    filePath.EnsureRuntimeDir(filePath.GetRuntimePath());
    clearAppLogs();

    const logFd = fs.openSync(filePath.GetAppLogPath(), "a");

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

function StopApp() {
    if (!appProcess || !IsAppRunning()) {
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

function ForceStopApp() {
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function clearAppLogs() {
    const logPath = filePath.GetAppLogPath();
    if (fs.existsSync(logPath)) {
        fs.writeFileSync(logPath, "");
    }
}

module.exports = {
    StartApp,
    StopApp,
    IsAppRunning,
    GetAppStatus,
    ReadAppLogs,
    ForceStopApp,
};
