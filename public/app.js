const logBox = document.getElementById('log-box');

function log(message) {
    const now = new Date().toLocaleTimeString();
    logBox.textContent += `\n[${now}] ${message}`;
  
    // 최대 줄 수 제한 (예: 200줄)
    const lines = logBox.textContent.split('\n');
    if (lines.length > 200) {
      logBox.textContent = lines.slice(-200).join('\n');
    }
  
    logBox.scrollTop = logBox.scrollHeight;
}

function updateStatusUI(status) {
    const currentBranchEl = document.getElementById('current-branch');
    const buildStatusEl = document.getElementById('build-status');
    const appStatusEl = document.getElementById('app-status');
    const appUrlEl = document.getElementById('app-url');
  
    if (currentBranchEl) currentBranchEl.textContent = status.currentBranch || 'unknown';
    if (buildStatusEl) buildStatusEl.textContent = status.buildStatus || 'idle';
    if (appStatusEl) appStatusEl.textContent = status.appStatus || 'stopped';
  
    if (appUrlEl && status.appUrl) {
      appUrlEl.textContent = status.appUrl;
      appUrlEl.href = status.appUrl;
    }
}

async function refreshStatus() {
    try {
      const response = await fetch('/api/status');
      const result = await response.json();
  
      if (!response.ok || !result.ok) {
        log(`Failed to refresh status: ${result.message || 'Unknown error'}`);
        return;
      }
  
      updateStatusUI(result);
    } catch (error) {
      log(`Status request error: ${error.message}`);
    }
}

document.getElementById('switch-pull-btn').addEventListener('click', async () => {
  const branch = document.getElementById('branch').value.trim();

  if (!branch) {
    log('Please enter a branch name.');
    return;
  }

  log(`Switch & Pull started. branch="${branch}"`);

  try {
    const response = await fetch('/api/switch-pull', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ branch }),
    });

    const result = await response.json();

    if (!response.ok) {
      log(`Failed: ${result.message || 'Unknown error'}`);
      if (result.stderr) log(`stderr:\n${result.stderr}`);
      if (result.stdout) log(`stdout:\n${result.stdout}`);
      return;
    }

    log(result.message);

    if (result.switch?.stdout) log(`switch stdout:\n${result.switch.stdout}`);
    if (result.switch?.stderr) log(`switch stderr:\n${result.switch.stderr}`);
    if (result.pull?.stdout) log(`pull stdout:\n${result.pull.stdout}`);
    if (result.pull?.stderr) log(`pull stderr:\n${result.pull.stderr}`);
  } catch (error) {
    log(`Request error: ${error.message}`);
  }
});

document.getElementById('build-btn').addEventListener('click', () => {
  log('Build clicked.');
});

document.getElementById('start-btn').addEventListener('click', () => {
  log('Start clicked.');
});

document.getElementById('stop-btn').addEventListener('click', () => {
  log('Stop clicked.');
});

document.getElementById('clear-log-btn').addEventListener('click', () => {
    logBox.textContent = '';
});

// 페이지 처음 열릴 때 상태 1번 가져오기
refreshStatus();

// 5초마다 상태 자동 새로고침
setInterval(refreshStatus, 5000);