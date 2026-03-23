const { getCurrentBranch } = require('./gitService');

function getLauncherStatus() {
  const hostMachineIp = process.env.HOST_MACHINE_IP || '10.77.3.32';

  return {
    currentBranch: getCurrentBranch(),
    buildStatus: 'idle',
    appStatus: 'stopped',
    appUrl: `http://${hostMachineIp}`,
  };
}

module.exports = {
  getLauncherStatus,
};