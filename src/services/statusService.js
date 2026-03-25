const gitService = require("./gitService");
const buildStatus = require("../utils/buildState");
const appService = require("./appService");

function GetLauncherStatus() {
    const hostMachineIp = process.env.HOST_MACHINE_IP || "10.77.3.32";

    return {
        currentBranch: gitService.GetCurrentBranch(),
        buildStatus: buildStatus.getBuildStatus(),
        appStatus: appService.GetAppStatus(),
        appUrl: `http://${hostMachineIp}`,
    };
}

module.exports = {
    GetLauncherStatus,
};
