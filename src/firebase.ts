import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc,
  getDocs, 
  setDoc, 
  collection, 
  getDocFromServer
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { 
  mockStudentProfile, 
  mockAnnouncements, 
  mockAgendaEvents, 
  mockGalleryImages, 
  mockInventory, 
  mockPayments, 
  mockDisciplineRecords 
} from './data';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Perform test connection as strictly required by validation checklist in SKILL.md
export async function validateConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}

// Automatically seed mock data to Firestore so the user has fully working live items
export async function seedDatabaseIfEmpty() {
  try {
    // 1. Ensure user is authenticated so security rules allow writing config
    if (!auth.currentUser) {
      try {
        await signInAnonymously(auth);
      } catch (authError: any) {
        console.warn('Anonymous auth is restricted/disabled in Firebase Console. Attempting to seed without auth...', authError.message || authError);
      }
    }

    // Checking if already seeded by reading the profile doc
    const profileRef = doc(db, 'student_profiles', mockStudentProfile.nis);
    const profileSnap = await getDoc(profileRef);

    if (!profileSnap.exists()) {
      console.log('Database empty! Seeding initial data...');

      // Seed Student Profile
      await setDoc(profileRef, mockStudentProfile);

      // Seed Announcements
      for (const ann of mockAnnouncements) {
        await setDoc(doc(db, 'announcements', ann.id), ann);
      }

      // Seed Agenda Events
      for (const evt of mockAgendaEvents) {
        await setDoc(doc(db, 'agenda_events', evt.id), evt);
      }

      // Seed Gallery Images
      for (const img of mockGalleryImages) {
        await setDoc(doc(db, 'gallery_images', img.id), img);
      }

      // Seed Inventory
      for (const inv of mockInventory) {
        await setDoc(doc(db, 'inventory_items', inv.id), inv);
      }

      // Seed Payments
      for (const pay of mockPayments) {
        await setDoc(doc(db, 'payment_logs', pay.id), pay);
      }

      // Seed Discipline
      for (const disc of mockDisciplineRecords) {
        await setDoc(doc(db, 'discipline_records', disc.id), disc);
      }

      console.log('Database successfully seeded with Initial Mock Data in Firestore!');
    } else {
      console.log('Database already initialized. skipping seed.');
    }
  } catch (e) {
    console.error('Failed to seed database:', e);
  }
}

// Trigger validation on load
validateConnection();
