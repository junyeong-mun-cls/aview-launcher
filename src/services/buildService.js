const fs = require("fs");
const { spawn } = require("child_process");

const filePath = require("../utils/filepath");

const {
    setBuildStatus,
    setBuildRunning,
    isBuildRunning,
} = require("../utils/buildState");

function ReadBuildLogs() {
    const logPath = filePath.GetBuildLogPath();

    if (!fs.existsSync(logPath)) {
        return "";
    }

    return fs.readFileSync(logPath, "utf8");
}

function ReadHubBuildLogs() {
    const logPath = filePath.GetHubBuildLogPath();

    if (!fs.existsSync(logPath)) {
        return "";
    }

    return fs.readFileSync(logPath, "utf8");
}

function StartHubBuild() {
    if (isBuildRunning()) {
        return {
            ok: false,
            message: "Build is already running.",
        };
    }

    const hubRepoPath = filePath.GetHubRootPath();

    if (!fs.existsSync(hubRepoPath)) {
        return {
            ok: false,
            message: `Hub repository path does not exist: ${hubRepoPath}`,
        };
    }

    const logPath = filePath.GetHubBuildLogPath();

    const logStream = fs.createWriteStream(logPath, {
        flags: "a",
    });

    setBuildRunning(true);
    setBuildStatus("building");

    appendLog(logStream, `[hub] cwd: ${hubRepoPath}\n`);
    appendLog(logStream, `[hub] Starting: make build\n`);

    const child = spawn("make", ["build"], {
        cwd: hubRepoPath,
        shell: false,
    });

    child.stdout.on("data", (data) => {
        appendLog(logStream, data.toString());
    });

    child.stderr.on("data", (data) => {
        appendLog(logStream, data.toString());
    });

    child.on("error", (error) => {
        appendLog(logStream, `\n[error] ${error.message}\n`);
        setBuildStatus("failed");
        setBuildRunning(false);
        logStream.end();
    });

    child.on("close", (code) => {
        if (code === 0) {
            appendLog(
                logStream,
                `[hub] make build finished with exit code 0\n`,
            );
            setBuildStatus("success");
        } else {
            appendLog(
                logStream,
                `[hub] make build finished with exit code ${code}\n`,
            );
            setBuildStatus("failed");
        }

        setBuildRunning(false);
        logStream.end();
    });

    return {
        ok: true,
        message: "Hub build started.",
    };
}
function StartBuild() {
    if (isBuildRunning()) {
        return {
            ok: false,
            message: "Build is already running.",
        };
    }

    const buildDir = filePath.GetBuildPath();
    const buildType = process.env.BUILD_TYPE || "Release";
    const buildJobs = process.env.BUILD_JOBS || "80";

    if (!fs.existsSync(buildDir)) {
        return {
            ok: false,
            message: `Build directory does not exist: ${buildDir}`,
        };
    }

    filePath.EnsureDir(filePath.GetRuntimePath());
    const logPath = filePath.GetBuildLogPath();

    const logStream = fs.createWriteStream(logPath, {
        flags: "a",
    });

    setBuildRunning(true);
    setBuildStatus("building");

    const buildArgs = [
        "--build",
        buildDir,
        "--config",
        buildType,
        "--target",
        "all",
        "-j",
        String(buildJobs),
        "--",
    ];

    appendLog(logStream, `[main] Building folder: ${buildDir}\n`);
    appendLog(logStream, `[build] Starting build\n`);
    appendLog(
        logStream,
        `[proc] Executing command: /usr/bin/cmake ${buildArgs.join(" ")}\n`,
    );

    const child = spawn("cmake", buildArgs, {
        cwd: buildDir,
        shell: false,
    });

    child.stdout.on("data", (data) => {
        appendLog(logStream, data.toString());
    });

    child.stderr.on("data", (data) => {
        appendLog(logStream, data.toString());
    });

    child.on("error", (error) => {
        appendLog(logStream, `\n[error] ${error.message}\n`);
        setBuildStatus("failed");
        setBuildRunning(false);
        logStream.end();
    });

    child.on("close", (code) => {
        if (code === 0) {
            appendLog(logStream, `[driver] Build completed with exit code 0\n`);
            appendLog(logStream, `[build] Build finished with exit code 0\n`);
            setBuildStatus("success");
        } else {
            appendLog(
                logStream,
                `[driver] Build completed with exit code ${code}\n`,
            );
            appendLog(
                logStream,
                `[build] Build finished with exit code ${code}\n`,
            );
            setBuildStatus("failed");
        }

        setBuildRunning(false);
        logStream.end();
    });

    return {
        ok: true,
        message: "Build started.",
    };
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function appendLog(stream, message) {
    stream.write(message);
}

module.exports = {
    StartBuild,
    StartHubBuild,
    ReadBuildLogs,
    ReadHubBuildLogs,
};
