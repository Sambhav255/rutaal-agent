# Push rutaal-agent to GitHub
# Prefer full Git for Windows (has HTTPS/SSH). VS Git is incomplete.
$gitPaths = @(
    "C:\Program Files\Git\cmd\git.exe",
    "C:\Program Files (x86)\Git\cmd\git.exe",
    "C:\Program Files (x86)\Microsoft Visual Studio\2017\Community\Common7\IDE\CommonExtensions\Microsoft\TeamFoundation\Team Explorer\Git\cmd\git.exe"
)
$gitPath = $null
foreach ($p in $gitPaths) {
    if (Test-Path $p) { $gitPath = $p; break }
}
if (-not $gitPath) {
    Write-Host "Git not found. Install from https://git-scm.com/download/win" -ForegroundColor Red
    Write-Host "Then restart your terminal and run: npm run push" -ForegroundColor Yellow
    exit 1
}

# Add Git to PATH for this session (helps find curl for HTTPS)
$gitDir = Split-Path (Split-Path $gitPath)
$env:Path = "$gitDir\cmd;$gitDir\mingw64\bin;$env:Path"

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $projectRoot

Write-Host "Using Git: $gitPath" -ForegroundColor Gray
Write-Host "Staging files..." -ForegroundColor Cyan
& $gitPath add .
$status = & $gitPath status --short
if ($status) { & $gitPath status }
Write-Host "`nCommitting..." -ForegroundColor Cyan
& $gitPath commit -m "Update Ruta'al demo for launch" 2>&1 | ForEach-Object {
    if ($_ -match "nothing to commit") { Write-Host $_ -ForegroundColor Yellow }
    else { Write-Host $_ }
}
Write-Host "`nPushing to origin main..." -ForegroundColor Cyan
$pushResult = & $gitPath push -u origin main 2>&1
$pushExit = $LASTEXITCODE
Write-Host $pushResult

if ($pushExit -ne 0) {
    if ($pushResult -match "remote helper for 'https'" -or $pushResult -match "cannot spawn ssh") {
        Write-Host "`n--- FIX: Install full Git for Windows ---" -ForegroundColor Red
        Write-Host "The Git from Visual Studio cannot push (no HTTPS/SSH)." -ForegroundColor Yellow
        Write-Host "1. Download: https://git-scm.com/download/win" -ForegroundColor White
        Write-Host "2. Run the installer (use default options)" -ForegroundColor White
        Write-Host "3. Restart your terminal, then run: npm run push" -ForegroundColor White
    }
    exit $pushExit
}
Write-Host "`nDone." -ForegroundColor Green
