const path = require('path');
const express = require('express');
const dotenv = require('dotenv');

const app = express();

dotenv.config();
const hostMachineIp = process.env.HOST_MACHINE_IP || '10.77.3.32';
const port = Number(process.env.HOST_MACHINE_PORT) || 8088;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 정적 파일 연결
app.use(express.static(path.join(__dirname, 'public')));

// EJS 설정
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 메인 페이지
app.get('/', (req, res) => {
    res.render('index', {
        title: 'AView Launcher',
        currentBranch: 'unknown',
        buildStatus: 'idle',
        appStatus: 'stopped',
        appUrl: `http://${hostMachineIp}`
    });
});

// 서버 시작
app.listen(port, '0.0.0.0', () => {
    console.log(`Launcher server is running on http://${hostMachineIp}:${port}`);
});


