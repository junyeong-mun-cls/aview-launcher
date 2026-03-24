const { getCurrentBranch } = require("./gitService");
const { getBuildStatus } = require("./buildState");
const { getAppStatus } = require("./appService");

function getLauncherStatus() {
    const hostMachineIp = process.env.HOST_MACHINE_IP || "10.77.3.32";

    return {
        currentBranch: getCurrentBranch(),
        buildStatus: getBuildStatus(),
        appStatus: getAppStatus(),
        appUrl: `http://${hostMachineIp}`,
    };
}

module.exports = {
    getLauncherStatus,
};
