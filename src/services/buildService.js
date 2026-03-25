const fs = require("fs");
const path = require("path");
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
    ReadBuildLogs,
};
