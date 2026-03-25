const fs = require("fs");
const path = require("path");

function GetRootPath() {
    return process.env.AVIEW_REPO_PATH || path.join(__dirname, "..", "..");
}

function GetRuntimePath() {
    return path.join(GetRootPath(), "runtime");
}

function GetAppLogPath() {
    p = path.join(GetRuntimePath(), "app.log");
    EnsureRuntimeDir(p);
    return p;
}

function GetBuildLogPath() {
    p = path.join(GetRuntimePath(), "build.log");
    EnsureRuntimeDir(p);
    return p;
}

function GetBinPath() {
    return path.join(GetRootPath(), "build", "bin");
}

function GetBuildPath() {
    return path.join(GetRootPath(), "build");
}

function EnsureRuntimeDir(p) {
    if (!fs.existsSync(p)) {
        fs.mkdirSync(p, { recursive: true });
    }
}

module.exports = {
    GetRootPath,
    EnsureRuntimeDir,
    GetBinPath,
    GetAppLogPath,
    GetBuildLogPath,
    GetBuildPath,
};
