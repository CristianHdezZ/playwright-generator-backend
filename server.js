// server.js
import express from 'express';
import cors from 'cors';
import { spawn } from 'child_process';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

app.get('/log', (req, res) => {
  // Configurar SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const projectName = req.query.project || 'my-project';
  const setupPath = path.join(process.cwd(), 'setup.js');

  const child = spawn('node', [setupPath, projectName]);

  // Stream stdout y stderr al frontend
  child.stdout.on('data', data => res.write(`data: ${data.toString()}\n\n`));
  child.stderr.on('data', data => res.write(`data: ${data.toString()}\n\n`));

  child.on('close', code => {
    res.write(`data: ✅ Proyecto "${projectName}" finalizado con código ${code}\n\n`);
    res.end();
  });
});

app.listen(PORT, () => console.log(`Backend corriendo en http://localhost:${PORT}`));
