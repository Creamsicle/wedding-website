import { db } from '../lib/firebase/config';
import {
  collection,
  getDocs,
  doc,
  writeBatch,
  getDoc,
  deleteDoc,
  DocumentData,
  DocumentReference,
} from 'firebase/firestore';

interface MigrationStats {
  total: number;
  processed: number;
  successful: number;
  failed: number;
  skipped: number;
}

const BATCH_SIZE = 100;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

function generateNewDocId(firstName: string, lastName: string): string {
  const random4Digits = Math.floor(1000 + Math.random() * 9000);
  return `${firstName.toLowerCase()}${lastName.toLowerCase()}${random4Digits}`;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function processDocumentWithRetry(
  docRef: DocumentReference<DocumentData>,
  newId: string,
  batch: any,
  retryCount = 0
): Promise<boolean> {
  try {
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      console.log(`Document ${docRef.id} no longer exists, skipping...`);
      return false;
    }

    const data = docSnap.data();
    const newDocRef = doc(collection(db, 'guests'), newId);
    
    // Add the new document with the same data
    batch.set(newDocRef, data);
    // Delete the old document
    batch.delete(docRef);
    
    return true;
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying document ${docRef.id} (attempt ${retryCount + 1})...`);
      await sleep(RETRY_DELAY_MS * Math.pow(2, retryCount));
      return processDocumentWithRetry(docRef, newId, batch, retryCount + 1);
    } else {
      console.error(`Failed to process document ${docRef.id} after ${MAX_RETRIES} retries:`, error);
      return false;
    }
  }
}

async function migrateDocumentIds(): Promise<void> {
  const stats: MigrationStats = {
    total: 0,
    processed: 0,
    successful: 0,
    failed: 0,
    skipped: 0,
  };

  try {
    // Get all documents
    const guestsRef = collection(db, 'guests');
    const snapshot = await getDocs(guestsRef);
    stats.total = snapshot.size;

    console.log(`Starting migration of ${stats.total} documents...`);
    console.log('Processing in batches of', BATCH_SIZE);

    // Process in batches
    let currentBatch = writeBatch(db);
    let batchCount = 0;
    let currentBatchSize = 0;

    for (const docSnapshot of snapshot.docs) {
      const data = docSnapshot.data();
      
      // Skip if firstName or lastName is missing
      if (!data.firstName || !data.lastName) {
        console.log(`Skipping document ${docSnapshot.id} - missing name data`);
        stats.skipped++;
        continue;
      }

      const newId = generateNewDocId(data.firstName, data.lastName);
      const success = await processDocumentWithRetry(
        docSnapshot.ref,
        newId,
        currentBatch
      );

      if (success) {
        stats.successful++;
      } else {
        stats.failed++;
      }

      currentBatchSize++;
      stats.processed++;

      // Commit batch if it reaches BATCH_SIZE
      if (currentBatchSize === BATCH_SIZE) {
        try {
          await currentBatch.commit();
          batchCount++;
          console.log(`Committed batch ${batchCount} (${stats.processed}/${stats.total} documents processed)`);
          
          // Start new batch
          currentBatch = writeBatch(db);
          currentBatchSize = 0;
          
          // Add a small delay between batches to prevent overwhelming Firebase
          await sleep(500);
        } catch (error) {
          console.error(`Failed to commit batch ${batchCount}:`, error);
          stats.failed += currentBatchSize;
          stats.successful -= currentBatchSize;
          
          // Start new batch
          currentBatch = writeBatch(db);
          currentBatchSize = 0;
        }
      }
    }

    // Commit any remaining documents in the last batch
    if (currentBatchSize > 0) {
      try {
        await currentBatch.commit();
        console.log(`Committed final batch (${stats.processed}/${stats.total} documents processed)`);
      } catch (error) {
        console.error('Failed to commit final batch:', error);
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

  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

// Run the migration if this script is executed directly
if (require.main === module) {
  migrateDocumentIds()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
} 