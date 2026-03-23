const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const { spawn } = require('child_process')

const app = express()

dotenv.config()
const hostMachineIp = process.env.HOST_MACHINE_IP || '10.77.3.32'
const port = Number(process.env.HOST_MACHINE_PORT) || 8088

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// 정적 파일 연결
app.use(express.static(path.join(__dirname, 'public')))

// EJS 설정
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// 메인 페이지
app.get('/', (req, res) => {
  res.render('index', {
    title: 'AView Launcher',
    currentBranch: 'unknown',
    buildStatus: 'idle',
    appStatus: 'stopped',
    appUrl: `http://${hostMachineIp}`
  })
})

app.post('/api/switch-pull', async (req, res) => {
    const repoPath = process.env.AVIEW_REPO_PATH;
    const branch = (req.body.branch || '').trim();
  
    if (!branch) {
      return res.status(400).json({
        ok: false,
        message: 'Branch is required.',
      });
    }
  
    if (!isValidBranchName(branch)) {
      return res.status(400).json({
        ok: false,
        message: 'Invalid branch name.',
      });
    }
  
    try {
      const switchResult = await runCommand('git', ['switch', branch], {
        cwd: repoPath,
      });
  
      if (switchResult.code !== 0) {
        return res.status(500).json({
          ok: false,
          step: 'switch',
          message: 'git switch failed.',
          stdout: switchResult.stdout,
          stderr: switchResult.stderr,
        });
      }
  
      const pullResult = await runCommand('git', ['pull', '-r'], {
        cwd: repoPath,
      });
  
      if (pullResult.code !== 0) {
        return res.status(500).json({
          ok: false,
          step: 'pull',
          message: 'git pull -r failed.',
          stdout: pullResult.stdout,
          stderr: pullResult.stderr,
        });
      }
  
      return res.json({
        ok: true,
        message: 'Switch & Pull completed successfully.',
        branch,
        switch: {
          stdout: switchResult.stdout,
          stderr: switchResult.stderr,
        },
        pull: {
          stdout: pullResult.stdout,
          stderr: pullResult.stderr,
        },
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        message: 'Unexpected server error.',
        error: error.message,
      });
    }
  });

function runCommand (command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd || process.cwd(),
      shell: false
    })

    let stdout = ''
    let stderr = ''

    child.stdout.on('data', (data) => {
      stdout += data.toString()
    })

    child.stderr.on('data', (data) => {
      stderr += data.toString()
    })

    child.on('error', (error) => {
      reject(error)
    })

    child.on('close', (code) => {
      resolve({
        code,
        stdout,
      stderr})
    })
  })
}

// 서버 시작
app.listen(port, '0.0.0.0', () => {
  console.log(`Launcher server is running on http://${hostMachineIp}:${port}`)
})
