Write-Host "Starting document ID migration..."
Write-Host "This script will update all guest document IDs to the format: firstnamelastname1234"
Write-Host "Please make sure you have a backup of your data before proceeding."
Write-Host ""

$confirmation = Read-Host "Are you sure you want to proceed? (y/n)"
if ($confirmation -ne 'y') {
    Write-Host "Migration cancelled."
    exit 0
}

try {
    Write-Host "Running migration script..."
    npx ts-node src/scripts/migrateDocumentIds.ts
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Migration completed successfully!"
    } else {
        Write-Host "Migration failed with exit code $LASTEXITCODE"
        exit $LASTEXITCODE
    }
} catch {
    Write-Host "An error occurred during migration: $_"
    exit 1
} 