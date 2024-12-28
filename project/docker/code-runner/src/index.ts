import express from 'express';
import { exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(express.json());

const TIMEOUT = 10000; // 10 seconds
const MAX_BUFFER = 1024 * 1024; // 1MB

interface ExecuteRequest {
  code: string;
  language: string;
  input: string;
}

app.post('/execute', async (req, res) => {
  const { code, language, input }: ExecuteRequest = req.body;
  const id = uuidv4();
  const codePath = path.join('/code', id);

  try {
    // Create temporary directory
    await fs.mkdir(codePath);

    // Write code and input files
    const fileExtension = getFileExtension(language);
    const filePath = path.join(codePath, `main${fileExtension}`);
    const inputPath = path.join(codePath, 'input.txt');

    await fs.writeFile(filePath, code);
    await fs.writeFile(inputPath, input);

    // Execute code
    const { command, args } = getExecutionCommand(language, filePath);
    
    const result = await executeCode(command, args, codePath, input);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    // Cleanup
    try {
      await fs.rm(codePath, { recursive: true });
    } catch (error) {
      console.error('Cleanup failed:', error);
    }
  }
});

function getFileExtension(language: string): string {
  const extensions: Record<string, string> = {
    python: '.py',
    javascript: '.js',
    java: '.java',
    cpp: '.cpp',
  };
  return extensions[language] || '.txt';
}

function getExecutionCommand(language: string, filePath: string): { command: string; args: string[] } {
  switch (language) {
    case 'python':
      return { command: 'python3', args: [filePath] };
    case 'javascript':
      return { command: 'node', args: [filePath] };
    case 'java':
      return { command: 'java', args: [filePath] };
    case 'cpp':
      const outputPath = filePath.replace('.cpp', '');
      return { command: 'g++', args: [filePath, '-o', outputPath] };
    default:
      throw new Error('Unsupported language');
  }
}

async function executeCode(command: string, args: string[], cwd: string, input: string) {
  return new Promise((resolve, reject) => {
    const process = exec(
      `${command} ${args.join(' ')}`,
      {
        cwd,
        timeout: TIMEOUT,
        maxBuffer: MAX_BUFFER,
      },
      (error, stdout, stderr) => {
        if (error && error.killed) {
          resolve({ status: 'time_limit_exceeded' });
        } else if (error) {
          resolve({
            status: 'runtime_error',
            error: stderr || error.message,
          });
        } else {
          resolve({
            status: 'success',
            output: stdout,
            runtime: Date.now() - startTime,
          });
        }
      }
    );

    const startTime = Date.now();
    if (input) {
      process.stdin?.write(input);
      process.stdin?.end();
    }
  });
}

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Code runner service listening on port ${port}`);
});