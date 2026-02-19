const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { execSync } = require('child_process');

const workspacePath = process.cwd().replace(/\\/g, '\\\\');

function killWorkspaceNextProcesses() {
    try {
        if (process.platform === 'win32') {
            const command = `Get-CimInstance Win32_Process | Where-Object { $_.Name -eq 'node.exe' -and $_.CommandLine -match '${workspacePath}' -and $_.CommandLine -match 'next' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue; Write-Output \"Stopped PID $($_.ProcessId)\" }`;
            execSync(`powershell -NoProfile -Command "${command}"`, {
                stdio: ['ignore', 'pipe', 'ignore'],
                encoding: 'utf8',
            });
            return;
        }

        execSync(`pkill -f "${process.cwd()}/.*next"`, {
            stdio: ['ignore', 'ignore', 'ignore'],
        });
    } catch {
        // no-op
    }
}

function removeLockFiles() {
    const nextLock = path.join(process.cwd(), '.next', 'lock');
    const nextDevLock = path.join(process.cwd(), '.next', 'dev', 'lock');

    try {
        if (fs.existsSync(nextLock)) {
            fs.rmSync(nextLock, { force: true });
            console.log('Removed .next/lock');
        }
    } catch { }

    try {
        if (fs.existsSync(nextDevLock)) {
            fs.rmSync(nextDevLock, { force: true });
            console.log('Removed .next/dev/lock');
        }
    } catch { }
}

function runBuild() {
    const nextBin = require.resolve('next/dist/bin/next');
    const child = spawn(process.execPath, [nextBin, 'build'], {
        stdio: 'inherit',
    });

    child.on('exit', (code) => {
        process.exit(code ?? 0);
    });
}

killWorkspaceNextProcesses();
removeLockFiles();
runBuild();
