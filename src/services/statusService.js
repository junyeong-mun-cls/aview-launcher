const { getCurrentBranch } = require("./gitService");
const { getBuildStatus } = require("./buildState");

function getLauncherStatus() {
    const hostMachineIp = process.env.HOST_MACHINE_IP || "10.77.3.32";

    return {
        currentBranch: getCurrentBranch(),
        buildStatus: getBuildStatus(),
        appStatus: "stopped",
        appUrl: `http://${hostMachineIp}`,
    };
}

module.exports = {
    getLauncherStatus,
};
