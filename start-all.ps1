# SmartHire Full Stack Launcher
$mongoBin = "$env:USERPROFILE\.mongodb\bin\mongod.exe"
$mongoData = "$env:USERPROFILE\.mongodb\data\db"

# Check if MongoDB is already listening on port 27017
$mongoRunning = Get-NetTCPConnection -LocalPort 27017 -ErrorAction SilentlyContinue
if (-not $mongoRunning) {
    Write-Host "[SmartHire] Starting local MongoDB instance..." -ForegroundColor Cyan
    Start-Process -FilePath $mongoBin -ArgumentList "--dbpath `"$mongoData`" --port 27017 --bind_ip 127.0.0.1" -WindowStyle Hidden
    Start-Sleep -Seconds 2
} else {
    Write-Host "[SmartHire] MongoDB is already active on port 27017." -ForegroundColor Green
}

Write-Host "[SmartHire] Starting Backend API server on port 5000..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot\server'; npm run dev"

Write-Host "[SmartHire] Starting Frontend Client on port 5173..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot\client'; npm run dev"

Write-Host "`n========================================================" -ForegroundColor Green
Write-Host "SmartHire Platform is launching!" -ForegroundColor Green
Write-Host "Frontend Client:  http://localhost:5173" -ForegroundColor White
Write-Host "Backend API:      http://localhost:5000" -ForegroundColor White
Write-Host "Health Endpoint:  http://localhost:5000/api/health" -ForegroundColor White
Write-Host "========================================================`n" -ForegroundColor Green
