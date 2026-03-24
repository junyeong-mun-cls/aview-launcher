const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const { getRepoRoot } = require("./gitService");
const {
    setBuildStatus,
    setBuildRunning,
    isBuildRunning,
} = require("../utils/buildState");

const runtimeDir = path.join(__dirname, "..", "..", "runtime");
const buildLogPath = path.join(runtimeDir, "build.log");

function ensureRuntimeDir() {
    if (!fs.existsSync(runtimeDir)) {
        fs.mkdirSync(runtimeDir, { recursive: true });
    }
}

function getBuildLogPath() {
    ensureRuntimeDir();
    return buildLogPath;
}

function readBuildLogs() {
    const logPath = getBuildLogPath();

    if (!fs.existsSync(logPath)) {
        return "";
    }

    return fs.readFileSync(logPath, "utf8");
}

function clearBuildLogs() {
    const logPath = getBuildLogPath();

    if (fs.existsSync(logPath)) {
        fs.writeFileSync(logPath, "");
    }
}

function appendLog(stream, message) {
    stream.write(message);
}

function startBuild() {
    if (isBuildRunning()) {
        return {
            ok: false,
            message: "Build is already running.",
        };
    }

    const repoRoot = getRepoRoot();
    const buildDir = path.join(repoRoot, "build");
    const buildType = process.env.BUILD_TYPE || "Release";
    const buildJobs = process.env.BUILD_JOBS || "80";

    if (!fs.existsSync(buildDir)) {
        return {
            ok: false,
            message: `Build directory does not exist: ${buildDir}`,
        };
    }

    ensureRuntimeDir();
    clearBuildLogs();

    const logStream = fs.createWriteStream(getBuildLogPath(), { flags: "a" });

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

module.exports = {
    startBuild,
    readBuildLogs,
};
