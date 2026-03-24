const path = require("path");
const express = require("express");
const dotenv = require("dotenv");

const pageRoutes = require("./src/routes/pageRoutes");
const statusRoutes = require("./src/routes/statusRoutes");
const buildRoutes = require("./src/routes/buildRoutes");

dotenv.config();
const app = express();

const hostMachineIp = process.env.HOST_MACHINE_IP || "10.77.3.32";
const port = Number(process.env.HOST_MACHINE_PORT) || 8088;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 정적 파일 연결
app.use(express.static(path.join(__dirname, "public")));

// EJS 설정
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use("/", pageRoutes);
app.use("/api", statusRoutes);
app.use("/api", buildRoutes);

// 서버 시작
app.listen(port, "0.0.0.0", () => {
    console.log(
        `Launcher server is running on http://${hostMachineIp}:${port}`,
    );
});
