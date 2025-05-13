import { db } from '../lib/firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import fs from 'fs';
import { parse } from 'csv-parse';
import path from 'path';

interface GuestImport {
  firstName: string;
  lastName: string;
  partyId: string;
}

interface ValidationError {
  row: number;
  errors: string[];
}

function validateGuest(record: any, rowIndex: number): ValidationError | null {
  const errors: string[] = [];

  // Check required fields
  ['firstName', 'lastName', 'partyId'].forEach(field => {
    if (!record[field] || record[field].trim() === '') {
      errors.push(`Missing or empty ${field}`);
    }
  });

  // Check for invalid characters in names
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  if (record.firstName && !nameRegex.test(record.firstName.trim())) {
    errors.push('First name contains invalid characters');
  }
  if (record.lastName && !nameRegex.test(record.lastName.trim())) {
    errors.push('Last name contains invalid characters');
  }

  // Check field lengths
  if (record.firstName && record.firstName.length > 50) {
    errors.push('First name is too long (max 50 characters)');
  }
  if (record.lastName && record.lastName.length > 50) {
    errors.push('Last name is too long (max 50 characters)');
  }
  if (record.partyId && record.partyId.length > 50) {
    errors.push('Party ID is too long (max 50 characters)');
  }

  return errors.length > 0 ? { row: rowIndex, errors } : null;
}

async function validateCSV(csvFilePath: string): Promise<ValidationError[]> {
  const fileContent = fs.readFileSync(csvFilePath, 'utf-8');
  const records: any[] = [];
  const errors: ValidationError[] = [];
  
  // Validate CSV structure
  const parser = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    on_record: (record, context) => {
      records.push({ record, context });
      return record;
    }
  });

  // Check header
  const requiredColumns = ['firstName', 'lastName', 'partyId'];
  const headerValidation = new Promise((resolve, reject) => {
    parser.on('headers', (headers: string[]) => {
      const missingColumns = requiredColumns.filter(col => !headers.includes(col));
      if (missingColumns.length > 0) {
        reject(`Missing required columns: ${missingColumns.join(', ')}`);
      }
      resolve(true);
    });
  });

  try {
    await headerValidation;
    
    // Validate each record
    let rowIndex = 2; // Start at 2 to account for header row
    for await (const record of parser) {
      const validationError = validateGuest(record, rowIndex);
      if (validationError) {
        errors.push(validationError);
      }
      rowIndex++;
    }
  } catch (error) {
    console.error('CSV Structure Error:', error);
    process.exit(1);
  }

  return errors;
}

async function importGuests(csvFilePath: string, isDryRun: boolean = false) {
  console.log(isDryRun ? '🔍 Starting dry run...' : '📝 Starting import...');
  
  // Validate CSV first
  const validationErrors = await validateCSV(csvFilePath);
  if (validationErrors.length > 0) {
    console.error('❌ Validation errors found:');
    validationErrors.forEach(error => {
      console.error(`Row ${error.row}:`);
      error.errors.forEach(err => console.error(`  - ${err}`));
    });
    process.exit(1);
  }

  const fileContent = fs.readFileSync(csvFilePath, 'utf-8');
  const parser = parse(fileContent, {
    columns: true,
    skip_empty_lines: true
  });

  const guestsRef = collection(db, 'guests');
  let successCount = 0;
  let errorCount = 0;

  for await (const record of parser) {
    const guest: GuestImport = {
      firstName: record.firstName.trim(),
      lastName: record.lastName.trim(),
      partyId: record.partyId.trim(),
    };

    const guestData = {
      ...guest,
      firstName_lower: guest.firstName.toLowerCase(),
      lastName_lower: guest.lastName.toLowerCase(),
    };

    if (isDryRun) {
      console.log(`✓ Would add guest: ${guest.firstName} ${guest.lastName} (Party: ${guest.partyId})`);
      successCount++;
    } else {
      try {
        await addDoc(guestsRef, guestData);
        console.log(`✓ Added guest: ${guest.firstName} ${guest.lastName}`);
        successCount++;
      } catch (error) {
        console.error(`❌ Error adding guest ${guest.firstName} ${guest.lastName}:`, error);
        errorCount++;
      }
    }
  }

  console.log('\nSummary:');
  console.log(`✓ Successful: ${successCount}`);
  if (!isDryRun) {
    console.log(`❌ Errors: ${errorCount}`);
  }
  console.log(isDryRun ? '🔍 Dry run completed!' : '📝 Import completed!');
}

// Check if running from command line
if (require.main === module) {
  const args = process.argv.slice(2);
  const csvPath = args[0];
  const isDryRun = args.includes('--dry-run');

  if (!csvPath) {
    console.error('Please provide the path to the CSV file');
    console.log('\nUsage:');
    console.log('  npx ts-node src/scripts/importGuests.ts <csv-file> [--dry-run]');
    console.log('\nOptions:');
    console.log('  --dry-run    Validate and show what would be imported without making changes');
    process.exit(1);
  }

  const absolutePath = path.resolve(csvPath);
  if (!fs.existsSync(absolutePath)) {
    console.error('CSV file not found:', absolutePath);
    process.exit(1);
  }

  importGuests(absolutePath, isDryRun)
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Import failed:', error);
      process.exit(1);
    });
} 