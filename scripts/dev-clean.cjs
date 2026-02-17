const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const nextDir = path.join(process.cwd(), '.next');

try {
    fs.rmSync(nextDir, { recursive: true, force: true });
    console.log('Removed .next cache');
} catch (error) {
    console.warn('Could not remove .next cache:', error.message);
}

const rawArgs = process.argv.slice(2).filter((arg, index) => !(index === 0 && arg === '--'));
const args = [];

for (let i = 0; i < rawArgs.length; i += 1) {
    const current = rawArgs[i];
    if (/^\d+$/.test(current) && (i === 0 || (!rawArgs[i - 1].startsWith('-') && !rawArgs[i - 1].startsWith('--')))) {
        args.push('--port', current);
        continue;
    }
    args.push(current);
}
const nextBin = require.resolve('next/dist/bin/next');
const child = spawn(
    process.execPath,
    [nextBin, 'dev', ...args],
    { stdio: 'inherit' },
);

child.on('exit', (code) => {
    process.exit(code ?? 0);
});
