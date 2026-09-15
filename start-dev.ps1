$pid = (netstat -ano | findstr :3000 | ForEach-Object { ($_ -split '\s+')[-1] } | Select-Object -First 1)

if ($pid) {
    taskkill /PID $pid /F
}

taskkill /IM node.exe /F 2>$null

if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
}

pnpm dev