const { execFileSync } = require("child_process");
const { runCommand } = require("../utils/runCommand");
const filePath = require("../utils/filepath");

function GetCurrentBranch(repoPath) {
    const cwd = repoPath ?? filePath.GetRootPath();

    try {
        const branch = execFileSync(
            "git",
            ["rev-parse", "--abbrev-ref", "HEAD"],
            {
                cwd,
                encoding: "utf8",
                maxBuffer: 1024 * 1024,
            },
        ).trim();

        if (branch === "HEAD") {
            const short = execFileSync(
                "git",
                ["rev-parse", "--short", "HEAD"],
                {
                    cwd,
                    encoding: "utf8",
                    maxBuffer: 1024 * 1024,
                },
            ).trim();

            return `detached @ ${short}`;
        }

        return branch;
    } catch {
        return "unknown";
    }
}

async function SwitchAndPullBranch(branchName, repoPath) {
    const cwd = repoPath ?? filePath.GetRootPath();
    // 1. fetch
    const fetchResult = await runCommand("git", ["fetch", "--all"], {
        cwd,
    });

    if (fetchResult.code !== 0) {
        return {
            ok: false,
            step: "fetch",
            message: "git fetch failed.",
            stdout: fetchResult.stdout,
            stderr: fetchResult.stderr,
        };
    }

    // 2. switch
    const switchResult = await runCommand("git", ["switch", branchName], {
        cwd,
    });

    if (switchResult.code !== 0) {
        return {
            ok: false,
            step: "switch",
            message: "git switch failed.",
            stdout: switchResult.stdout,
            stderr: switchResult.stderr,
        };
    }

    // 3. pull
    const pullResult = await runCommand("git", ["pull", "-r"], {
        cwd,
    });

    if (pullResult.code !== 0) {
        return {
            ok: false,
            step: "pull",
            message: "git pull -r failed.",
            stdout: pullResult.stdout,
            stderr: pullResult.stderr,
        };
    }

    return {
        ok: true,
        message: "Fetch → Switch → Pull completed successfully.",
        branch: branchName,
        currentBranch: GetCurrentBranch(cwd),

        fetch: {
            stdout: fetchResult.stdout,
            stderr: fetchResult.stderr,
        },
        switch: {
            stdout: switchResult.stdout,
            stderr: switchResult.stderr,
        },
        pull: {
            stdout: pullResult.stdout,
            stderr: pullResult.stderr,
        },
    };
}

module.exports = {
    GetCurrentBranch,
    SwitchAndPullBranch,
};
