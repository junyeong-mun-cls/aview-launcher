let buildStatus = "idle";
let buildRunning = false;

function setBuildStatus(status) {
    buildStatus = status;
}

function getBuildStatus() {
    return buildStatus;
}

function setBuildRunning(value) {
    buildRunning = value;
}

function isBuildRunning() {
    return buildRunning;
}

module.exports = {
    setBuildStatus,
    getBuildStatus,
    setBuildRunning,
    isBuildRunning,
};
