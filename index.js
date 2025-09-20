import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs-extra";
import archiver from "archiver";
import os from "os";
import { generateProject } from "./setup.js";

const app = express();
app.use(cors());
app.use(express.json());

// --------------------- Estado global ---------------------
let projectLogs = [];
let isRunning = false;
let currentProject = "";

// --------------------- Función para logs ---------------------
const addLog = (msg) => {
  projectLogs.push(msg);
  console.log(msg);
};

// --------------------- SSE: Logs en tiempo real ---------------------
app.get("/log", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Enviar logs históricos
  projectLogs.forEach((msg) => res.write(`data: ${msg}\n\n`));

  const interval = setInterval(() => {
    if (projectLogs.length > 0) {
      const newLogs = projectLogs.splice(0);
      newLogs.forEach((msg) => res.write(`data: ${msg}\n\n`));
    }
  }, 200);

  req.on("close", () => clearInterval(interval));
});

// --------------------- Crear proyecto ---------------------
app.post("/generate", async (req, res) => {
  const { projectName } = req.body;
  if (!projectName) return res.status(400).send("Nombre del proyecto obligatorio");

  if (isRunning) return res.status(409).send("Otro proyecto se está generando");

  projectLogs = [];
  isRunning = true;
  currentProject = projectName;

  try {
    addLog(`🚀 Iniciando proyecto: ${projectName}`);

    // Carpeta temporal para Vercel
    const tempDir = path.join(os.tmpdir(), projectName);
    await fs.ensureDir(tempDir);

    // generateProject debe usar options.path
    const projectPath = await generateProject(projectName, {
      path: tempDir,
      write: (msg) => addLog(msg),
    });

    addLog(`✅ Proyecto "${projectName}" generado con éxito`);

    isRunning = false;
    currentProject = "";

    res.send({ success: true, projectPath });
  } catch (err) {
    addLog(`❌ Error generando proyecto: ${err}`);
    isRunning = false;
    currentProject = "";
    res.status(500).send({ success: false, error: err.toString() });
  }
});

// --------------------- Descargar ZIP con logs ---------------------
app.get("/download-zip/:projectName", async (req, res) => {
  const { projectName } = req.params;
  const projectPath = path.join(os.tmpdir(), projectName);

  if (!fs.existsSync(projectPath)) return res.status(404).send("Proyecto no encontrado.");

  addLog(`📦 Iniciando compresión del proyecto "${projectName}"...`);

  res.setHeader("Content-Type", "application/zip");
  res.setHeader("Content-Disposition", `attachment; filename=${projectName}.zip`);

  const archive = archiver("zip", { zlib: { level: 9 } });

  archive.on("entry", (entry) => addLog(`📄 Añadiendo: ${entry.name}`));
  archive.on("warning", (err) => addLog(`⚠️ Warning ZIP: ${err}`));
  archive.on("error", (err) => {
    addLog(`❌ Error generando ZIP: ${err}`);
    res.status(500).send(`Error generando ZIP: ${err}`);
  });
  archive.on("end", () => addLog(`✅ ZIP generado correctamente para "${projectName}"`));

  archive.pipe(res);
  archive.directory(projectPath, false);
  await archive.finalize();
});

// ✅ Exportar app para Vercel
export default app;
