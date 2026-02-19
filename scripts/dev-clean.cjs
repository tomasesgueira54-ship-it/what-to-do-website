const fs = require('fs');
const path = require('path');
const net = require('net');
const { execSync } = require('child_process');
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

function isPortInUse(port) {
    if (process.platform === 'win32') {
        try {
            const output = execSync(`netstat -ano | findstr LISTENING | findstr :${port}`, {
                stdio: ['ignore', 'pipe', 'ignore'],
                encoding: 'utf8',
            });
            return Promise.resolve(Boolean(output.trim()));
        } catch {
            return Promise.resolve(false);
        }
    }

    return new Promise((resolve) => {
        const tester = net.createServer();
        tester
            .once('error', () => resolve(true))
            .once('listening', () => {
                tester.close(() => resolve(false));
            })
            .listen(port, '0.0.0.0');
    });
}

function tryFreePortOnWindows(port) {
    if (process.platform !== 'win32') return false;

    try {
        const output = execSync(`netstat -ano | findstr :${port}`, {
            stdio: ['ignore', 'pipe', 'ignore'],
            encoding: 'utf8',
        });

        const pids = new Set();
        output
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter(Boolean)
            .forEach((line) => {
                const parts = line.split(/\s+/);
                const pid = parts[parts.length - 1];
                if (/^\d+$/.test(pid)) pids.add(pid);
            });

        let killedAny = false;
        for (const pid of pids) {
            try {
                execSync(`taskkill /PID ${pid} /F`, {
                    stdio: ['ignore', 'ignore', 'ignore'],
                });
                killedAny = true;
                console.log(`Freed port ${port} by terminating PID ${pid}.`);
            } catch {
                // Ignore individual failures and continue trying others.
            }
        }

        return killedAny;
    } catch {
        return false;
    }
}

async function ensurePortArg() {
    const portArgIndex = args.findIndex((arg) => arg === '--port' || arg === '-p');

    if (portArgIndex >= 0) {
        const explicitPort = Number(args[portArgIndex + 1] || 3000);
        if (!(await isPortInUse(explicitPort))) {
            return;
        }

        const freedExplicit = tryFreePortOnWindows(explicitPort);
        if (freedExplicit && !(await isPortInUse(explicitPort))) {
            return;
        }

        let fallbackExplicitPort = explicitPort + 1;
        while (await isPortInUse(fallbackExplicitPort)) {
            fallbackExplicitPort += 1;
            if (fallbackExplicitPort > explicitPort + 10) break;
        }

        args[portArgIndex + 1] = String(fallbackExplicitPort);
        console.log(`Port ${explicitPort} is in use. Falling back to ${fallbackExplicitPort}.`);
        return;
    }

    const preferredPort = 3000;
    if (!(await isPortInUse(preferredPort))) {
        return;
    }

    const freed = tryFreePortOnWindows(preferredPort);
    if (freed && !(await isPortInUse(preferredPort))) {
        return;
    }

    let fallbackPort = 3001;
    while (await isPortInUse(fallbackPort)) {
        fallbackPort += 1;
        if (fallbackPort > 3010) break;
    }

    args.push('--port', String(fallbackPort));
    console.log(`Port ${preferredPort} is in use. Falling back to ${fallbackPort}.`);
}

const nextBin = require.resolve('next/dist/bin/next');

async function start() {
    await ensurePortArg();

    const child = spawn(
        process.execPath,
        [nextBin, 'dev', ...args],
        { stdio: 'inherit' },
    );

    child.on('exit', (code) => {
        process.exit(code ?? 0);
    });
}

start();
