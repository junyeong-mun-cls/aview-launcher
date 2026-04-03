const fs = require("fs");
const path = require("path");

function GetRootPath() {
    return process.env.AVIEW_REPO_PATH || path.join(__dirname, "..", "..");
}

/** Aviewhub 전용 git 작업 경로. 미설정 시 AVIEW_REPO_PATH와 동일하게 동작 */
function GetHubRootPath() {
    return (
        process.env.AVIEWHUB_REPO_PATH ||
        process.env.AVIEW_REPO_PATH ||
        path.join(__dirname, "..", "..")
    );
}

function GetRuntimePath() {
    const p = path.join(GetRootPath(), "runtime");
    EnsureDir(p);
    return p;
}

/**
 * runtime/app.log, runtime/build.log: 없으면 빈 파일 생성, 이미 파일이면 그대로 둠.
 * 예전 버그로 동일 이름의 디렉터리만 있으면 제거 후 빈 파일로 만듦 (EISDIR 방지).
 */
function ensureLogFileAt(filePath) {
    if (fs.existsSync(filePath)) {
        const stat = fs.statSync(filePath);
        if (stat.isFile()) {
            return;
        }
        if (stat.isDirectory()) {
            fs.rmSync(filePath, { recursive: true });
        }
    }
    fs.writeFileSync(filePath, "");
}

function GetAppLogPath() {
    const p = path.join(GetRuntimePath(), "app.log");
    ensureLogFileAt(p);
    return p;
}

function GetBuildLogPath() {
    const p = path.join(GetRuntimePath(), "build.log");
    ensureLogFileAt(p);
    return p;
}

function GetBinPath() {
    return path.join(GetRootPath(), "build", "bin");
}

function GetBuildPath() {
    return path.join(GetRootPath(), "build");
}

function EnsureDir(p) {
    if (!fs.existsSync(p)) {
        fs.mkdirSync(p, { recursive: true });
    }
}

module.exports = {
    GetRootPath,
    GetHubRootPath,
    EnsureDir,
    GetBinPath,
    GetAppLogPath,
    GetBuildLogPath,
    GetBuildPath,
    GetRuntimePath,
};
