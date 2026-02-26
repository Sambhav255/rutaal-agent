# Push rutaal-agent to GitHub
# Git from Visual Studio may not be in PATH - use full path
$gitPath = "C:\Program Files (x86)\Microsoft Visual Studio\2017\Community\Common7\IDE\CommonExtensions\Microsoft\TeamFoundation\Team Explorer\Git\cmd\git.exe"
if (-not (Test-Path $gitPath)) {
    Write-Host "Git not found. Install from https://git-scm.com/download/win" -ForegroundColor Red
    exit 1
}

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $projectRoot

Write-Host "Staging files..." -ForegroundColor Cyan
& $gitPath add .
& $gitPath status
Write-Host "`nCommitting..." -ForegroundColor Cyan
& $gitPath commit -m "Update Ruta'al demo for launch"
Write-Host "`nPushing to origin main..." -ForegroundColor Cyan
& $gitPath push -u origin main
Write-Host "`nDone." -ForegroundColor Green
