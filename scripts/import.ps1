$csvPath = "C:\Users\TTVCreamsicle\Desktop\guestsbulk1.csv"
$dryRun = $args -contains "--dry-run"

Write-Host "Starting import process..."
Write-Host "CSV Path: $csvPath"
Write-Host "Dry Run: $dryRun"

npx ts-node scripts/importGuests.ts $csvPath $(if ($dryRun) { "--dry-run" }) 