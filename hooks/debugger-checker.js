const { execSync } = require('child_process');
const { resolve } = require('path');
const { readFileSync } = require('fs');

function getStagedFiles() {
  return execSync('git diff --cached --name-only --diff-filter=ACM', {
    encoding: 'utf-8',
  })
    .trim()
    .split('\n');
}

function hasDebugger(line) {
  const regex = /\bdebugger\b/g;
  // Returns true if debugger statement is inside string or comment
  const isCommentOrString = (line) =>
    line.trim().startsWith('//') ||
    line.trim().startsWith('/*') ||
    line.trim().endsWith('*/') ||
    /(["']).*?[^\\]\1/.test(line);

  return !isCommentOrString(line) && regex.test(line);
}

function hasDebuggerStatement(file) {
  const fileContent = readFileSync(resolve(process.cwd(), file), {
    encoding: 'utf-8',
  });
  const lines = fileContent.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (
      line.startsWith('//') ||
      line.startsWith('/*') ||
      line.startsWith('*') ||
      line.endsWith('*/')
    ) {
      continue;
    }

    if (hasDebugger(line)) {
      return { file, line: i + 1 };
    }
  }

  return null;
}

function checkForDebuggerStatements() {
  const files = getStagedFiles();
  const jsFiles = files.filter((file) => /\.(mjs|[jt]s)$/.test(file));

  if (jsFiles.length <= 0) {
    return;
  }

  const errors = jsFiles
    .map((file) => hasDebuggerStatement(file))
    .filter((result) => result !== null);

  if (errors.length > 0) {
    errors.forEach((error) =>
      console.error(
        `Error: ${error.file}:${error.line} contains a 'debugger' statement`
      )
    );
    process.exit(1);
  }
}

checkForDebuggerStatements();
