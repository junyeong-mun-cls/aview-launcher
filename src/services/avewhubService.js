const filePath = require("../utils/filepath");

let runningTarget = null;

const actionLogs = {
    hub: [],
};

function GetRunningTarget() {
    return runningTarget;
}

function StartTarget(target, extraMessage = "") {
    if (runningTarget && runningTarget !== target) {
        return {
            ok: false,
            message: `${runningTarget} is already running. Stop it first.`,
        };
    }

    if (runningTarget === target) {
        return {
            ok: false,
            message: `${target} is already running.`,
        };
    }

    runningTarget = target;

    const fullMessage = extraMessage
        ? `${target} started. ${extraMessage}`
        : `${target} started.`;

    AppendActionLog(target, fullMessage);

    return {
        ok: true,
        message: fullMessage,
        runningTarget,
    };
}

function StopTarget(target) {
    if (runningTarget !== target) {
        return {
            ok: false,
            message: `${target} is not running.`,
        };
    }

    AppendActionLog(target, `${target} stopped.`);
    runningTarget = null;

    return {
        ok: true,
        message: `${target} stopped.`,
        runningTarget: null,
    };
}

function GetActionLogs() {
    return {
        runningTarget,
        logs: GetCurrentActionLogs(),
    };
}

// app log
function ClearAppLogs() {
    filePath.EnsureDir(filePath.GetRuntimePath());
    fs.writeFileSync(filePath.GetAppLogPath(), "");
}

function AppendAppLog(message) {
    filePath.EnsureDir(filePath.GetRuntimePath());
    const time = new Date().toLocaleTimeString();
    fs.appendFileSync(filePath.GetAppLogPath(), `[${time}] ${message}\n`);
}

function ReadAppLogs() {
    filePath.EnsureDir(filePath.GetRuntimePath());
    if (!fs.existsSync(filePath.GetAppLogPath())) return "";
    return fs.readFileSync(filePath.GetAppLogPath(), "utf8");
}

function AppendActionLog(target, message) {
    if (!actionLogs[target]) {
        return;
    }

    const time = new Date().toLocaleTimeString();
    actionLogs[target].push(`[${time}] ${message}`);

    if (actionLogs[target].length > 200) {
        actionLogs[target] = actionLogs[target].slice(-200);
    }
}

function GetCurrentActionLogs() {
    if (!runningTarget) {
        return "";
    }

    return actionLogs[runningTarget].join("\n");
}

module.exports = {
    GetRunningTarget,
    StartTarget,
    StopTarget,
    GetActionLogs,
    AppendActionLog,
    ClearAppLogs,
    AppendAppLog,
    ReadAppLogs,
};
