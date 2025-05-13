import { db } from '../lib/firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

async function exportGuests(outputPath?: string) {
  const guestsRef = collection(db, 'guests');
  const snapshot = await getDocs(guestsRef);
  
  // Prepare CSV header
  const csvRows = ['firstName,lastName,partyId'];
  
  // Add each guest to CSV rows
  snapshot.docs.forEach(doc => {
    const guest = doc.data();
    const row = [
      // Escape quotes and commas in fields
      guest.firstName.replace(/"/g, '""'),
      guest.lastName.replace(/"/g, '""'),
      guest.partyId.replace(/"/g, '""')
    ].map(field => `"${field}"`).join(',');
    
    csvRows.push(row);
  });

  const csvContent = csvRows.join('\n');

  if (outputPath) {
    // Write to specified file
    fs.writeFileSync(outputPath, csvContent);
    console.log(`✓ Exported ${snapshot.docs.length} guests to ${outputPath}`);
  } else {
    // Write to default location
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const defaultPath = path.join(process.cwd(), `guests-export-${timestamp}.csv`);
    fs.writeFileSync(defaultPath, csvContent);
    console.log(`✓ Exported ${snapshot.docs.length} guests to ${defaultPath}`);
  }

  // Print preview
  console.log('\nPreview of exported data:');
  console.log('------------------------');
  csvRows.slice(0, 6).forEach(row => console.log(row));
  if (snapshot.docs.length > 5) {
    console.log(`... and ${snapshot.docs.length - 5} more rows`);
  }
}

// Check if running from command line
if (require.main === module) {
  const outputPath = process.argv[2];
  
  exportGuests(outputPath)
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Export failed:', error);
      process.exit(1);
    });
} 