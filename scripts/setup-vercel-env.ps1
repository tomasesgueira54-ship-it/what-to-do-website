# ============================================================================
# Vercel Environment Variables Setup Script
# ============================================================================
# This script automatically adds the 4 required environment variables
# to your Vercel project using the Vercel CLI.
#
# Requirements:
#   - Vercel CLI installed: npm i -g vercel
#   - Already logged in to Vercel: vercel login
#   - Run from your project root directory
#
# Usage:
#   .\scripts\setup-vercel-env.ps1
# ============================================================================

$ErrorActionPreference = "Stop"

Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "Vercel Environment Variables Setup" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host ""

# Check if vercel CLI is installed (prefer npx for PATH consistency)
Write-Host "Checking Vercel CLI..." -ForegroundColor Yellow
try {
    $vercelVersion = & npx vercel --version 2>&1
    Write-Host "✓ Vercel CLI found: $vercelVersion" -ForegroundColor Green
}
catch {
    Write-Host "✗ Vercel CLI not found. Install Node/npm and try again." -ForegroundColor Red
    exit 1
}

Write-Host ""

Write-Host "Enter values (they are NOT stored in this script)." -ForegroundColor Yellow
$ghRepoOwner = Read-Host "GH_REPO_OWNER"
$ghRepoName = Read-Host "GH_REPO_NAME"
$ghDispatchToken = Read-Host "GH_DISPATCH_TOKEN"
$cronSecret = Read-Host "CRON_SECRET"

if ([string]::IsNullOrWhiteSpace($ghRepoOwner) -or
    [string]::IsNullOrWhiteSpace($ghRepoName) -or
    [string]::IsNullOrWhiteSpace($ghDispatchToken) -or
    [string]::IsNullOrWhiteSpace($cronSecret)) {
    Write-Host "✗ Missing required values. Aborting." -ForegroundColor Red
    exit 1
}

# Environment variables to add
$envVars = @(
    @{ name = "GH_REPO_OWNER"; value = $ghRepoOwner.Trim() },
    @{ name = "GH_REPO_NAME"; value = $ghRepoName.Trim() },
    @{ name = "GH_DISPATCH_TOKEN"; value = $ghDispatchToken.Trim() },
    @{ name = "CRON_SECRET"; value = $cronSecret.Trim() }
)

Write-Host "Adding environment variables..." -ForegroundColor Yellow
Write-Host ""

$successCount = 0
$failCount = 0

foreach ($env in $envVars) {
    Write-Host "Adding: $($env.name)" -ForegroundColor Cyan
    
    try {
        $tmpPath = ".tmp_$($env.name.ToLower()).txt"
        Set-Content -Path $tmpPath -Value $env.value -NoNewline
        cmd /c "npx vercel env add $($env.name) production --force < $tmpPath" 2>&1 | Out-Null
        Remove-Item $tmpPath -Force -ErrorAction SilentlyContinue
        Write-Host "  ✓ $($env.name) added successfully" -ForegroundColor Green
        $successCount += 1
    }
    catch {
        Remove-Item ".tmp_$($env.name.ToLower()).txt" -Force -ErrorAction SilentlyContinue
        Write-Host "  ✗ Failed to add $($env.name): $_" -ForegroundColor Red
        $failCount += 1
    }
}

Write-Host ""
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "  ✓ Success: $successCount" -ForegroundColor Green
Write-Host "  ✗ Failed: $failCount" -ForegroundColor Red
Write-Host "=====================================================" -ForegroundColor Cyan

if ($failCount -eq 0) {
    Write-Host ""
    Write-Host "✓ All environment variables added successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "  1. Go to https://vercel.com/dashboard" -ForegroundColor White
    Write-Host "  2. Select 'what-to-do-website' project" -ForegroundColor White
    Write-Host "  3. Deployments → 'Redeploy' (or git push) to apply variables" -ForegroundColor White
    Write-Host ""
    Write-Host "Your cron will run tomorrow at 06:30 UTC and then daily! 🚀" -ForegroundColor Green
    exit 0
}
else {
    Write-Host ""
    Write-Host "✗ Some variables failed to add. Check the errors above." -ForegroundColor Red
    Write-Host "Are you logged in to Vercel? Run: vercel login" -ForegroundColor Yellow
    exit 1
}
