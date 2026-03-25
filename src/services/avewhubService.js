let runningTarget = null;

const actionLogs = {
    hub: [],
    deepc: [],
    floy: [],
};

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

function GetRunningTarget() {
    return runningTarget;
}

function GetCurrentActionLogs() {
    if (!runningTarget) {
        return "";
    }

    return actionLogs[runningTarget].join("\n");
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

module.exports = {
    AppendActionLog,
    GetRunningTarget,
    StartTarget,
    StopTarget,
    GetActionLogs,
};
