const express = require('express');
const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

const TIMEOUT = 10000; // 10 seconds
const MAX_BUFFER = 1024 * 1024; // 1MB

app.post('/execute', async (req, res) => {
  const { code, language, input } = req.body;
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

function getFileExtension(language) {
  const extensions = {
    python: '.py',
    javascript: '.js',
    java: '.java',
    cpp: '.cpp'
  };
  return extensions[language] || '.txt';
}

function getExecutionCommand(language, filePath) {
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

function executeCode(command, args, cwd, input) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const process = exec(
      `${command} ${args.join(' ')}`,
      {
        cwd,
        timeout: TIMEOUT,
        maxBuffer: MAX_BUFFER
      },
      (error, stdout, stderr) => {
        if (error && error.killed) {
          resolve({ status: 'time_limit_exceeded' });
        } else if (error) {
          resolve({
            status: 'runtime_error',
            error: stderr || error.message
          });
        } else {
          resolve({
            status: 'success',
            output: stdout,
            runtime: Date.now() - startTime
          });
        }
      }
    );

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