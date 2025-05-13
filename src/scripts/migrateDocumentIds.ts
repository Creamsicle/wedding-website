import { db } from '../lib/firebase/config';
import { collection, getDocs, doc, writeBatch } from 'firebase/firestore';

interface MigrationStats {
  total: number;
  processed: number;
  successful: number;
  failed: number;
  skipped: number;
}

interface MigrationError {
  docId: string;
  error: Error;
}

const BATCH_SIZE = 500;
const DELAY_BETWEEN_BATCHES = 1000; // 1 second

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function generateId(firstName: string, lastName: string): string {
  const normalizedFirst = firstName.toLowerCase().replace(/[^a-z]/g, '');
  const normalizedLast = lastName.toLowerCase().replace(/[^a-z]/g, '');
  const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${normalizedFirst}${normalizedLast}${randomNum}`;
}

async function migrateDocumentIds(): Promise<void> {
  const stats: MigrationStats = {
    total: 0,
    processed: 0,
    successful: 0,
    failed: 0,
    skipped: 0
  };

  try {
    // Get all documents
    const guestsRef = collection(db, 'guests');
    const snapshot = await getDocs(guestsRef);
    stats.total = snapshot.size;

    console.log(`Found ${stats.total} documents to process`);

    let currentBatch = writeBatch(db);
    let currentBatchSize = 0;
    let batchCount = 0;
    const errors: MigrationError[] = [];

    // Process documents in batches
    for (const docSnapshot of snapshot.docs) {
      const data = docSnapshot.data();
      const oldId = docSnapshot.id;
      
      try {
        // Generate new ID based on name
        const newId = generateId(data.firstName, data.lastName);
        
        // Create new document with new ID
        const newDocRef = doc(guestsRef, newId);
        currentBatch.set(newDocRef, data);
        
        // Delete old document
        const oldDocRef = doc(guestsRef, oldId);
        currentBatch.delete(oldDocRef);
        
        currentBatchSize++;
        stats.processed++;
        stats.successful++;
        
        console.log(`Processing ${stats.processed}/${stats.total}: ${oldId} -> ${newId}`);
        
        // Commit batch if it reaches BATCH_SIZE
        if (currentBatchSize === BATCH_SIZE) {
          try {
            await currentBatch.commit();
            batchCount++;
            console.log(`Committed batch ${batchCount}`);
            
            // Start new batch
            currentBatch = writeBatch(db);
            currentBatchSize = 0;
            
            // Add delay between batches
            await sleep(DELAY_BETWEEN_BATCHES);
          } catch (error) {
            if (error instanceof Error) {
              console.error(`Failed to commit batch ${batchCount}:`, error.message);
              errors.push({ docId: oldId, error });
            }
            stats.failed += currentBatchSize;
            stats.successful -= currentBatchSize;
            
            // Start new batch
            currentBatch = writeBatch(db);
            currentBatchSize = 0;
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(`Failed to process document ${oldId}:`, error.message);
          errors.push({ docId: oldId, error });
        }
        stats.failed++;
        continue;
      }
    }

    // Commit any remaining documents
    if (currentBatchSize > 0) {
      try {
        await currentBatch.commit();
        console.log(`Committed final batch with ${currentBatchSize} documents`);
      } catch (error) {
        if (error instanceof Error) {
          console.error('Failed to commit final batch:', error.message);
          errors.forEach(err => console.error(`- ${err.docId}: ${err.error.message}`));
        }
        stats.failed += currentBatchSize;
        stats.successful -= currentBatchSize;
      }
    }

    // Print final statistics
    console.log('\nMigration completed!');
    console.log('Statistics:');
    console.log(`- Total documents: ${stats.total}`);
    console.log(`- Successfully processed: ${stats.successful}`);
    console.log(`- Failed: ${stats.failed}`);
    console.log(`- Skipped: ${stats.skipped}`);

    if (errors.length > 0) {
      console.log('\nErrors:');
      errors.forEach(err => console.error(`- ${err.docId}: ${err.error.message}`));
    }

  } catch (error) {
    if (error instanceof Error) {
      console.error('Migration failed:', error.message);
    }
    throw error;
  }
}

// Execute migration if running directly
if (require.main === module) {
  migrateDocumentIds()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
} 