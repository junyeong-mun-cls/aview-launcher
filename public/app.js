const logBox = document.getElementById('log-box');

function log(message) {
  const now = new Date().toLocaleTimeString();
  logBox.textContent += `\n[${now}] ${message}`;
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