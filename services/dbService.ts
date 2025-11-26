import { ShortLink, ApiResponse } from '../types';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, collection, doc, getDoc, setDoc, getDocs, deleteDoc, updateDoc, increment, Firestore, query, orderBy } from 'firebase/firestore';
import { firebaseConfig, isConfigured } from '../firebaseConfig';

/**
 * DB SERVICE (Firebase Only)
 * Connects directly to Firestore using the static configuration file.
 */

let firebaseApp: FirebaseApp | null = null;
let db: Firestore | null = null;

// Initialize Firebase immediately using the config file
const initFirebase = () => {
  if (!isConfigured) {
    console.error("Firebase has not been configured in firebaseConfig.ts");
    return;
  }
  
  try {
    firebaseApp = initializeApp(firebaseConfig);
    db = getFirestore(firebaseApp);
    console.log("Firebase initialized successfully");
  } catch (e) {
    console.error("Failed to initialize Firebase", e);
  }
};

initFirebase();

export const dbService = {
  // Check if the service is ready
  isReady: () => isConfigured && !!db,

  // CREATE
  async createLink(url: string, customSlug?: string): Promise<ApiResponse<ShortLink>> {
    if (!db) return { success: false, error: 'Database not configured' };

    try {
      let slug = customSlug;
      
      // If custom slug provided, check existence
      if (slug) {
        const docRef = doc(db, "links", slug);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { success: false, error: 'Slug already exists. Please choose another.' };
        }
      } else {
        // Generate random slug and check collision
        let retries = 5;
        while (retries > 0) {
            slug = Math.random().toString(36).substring(2, 8);
            const docRef = doc(db, "links", slug);
            const docSnap = await getDoc(docRef);
            if (!docSnap.exists()) break;
            retries--;
        }
        if (retries === 0) return { success: false, error: 'Failed to generate unique slug' };
      }

      const newLink: ShortLink = {
        id: slug!,
        originalUrl: url,
        createdAt: Date.now(),
        clicks: 0,
        aiGenerated: !!customSlug,
      };

      await setDoc(doc(db, "links", slug!), newLink);
      return { success: true, data: newLink };

    } catch (e: any) {
      console.error("Firebase Create Error", e);
      return { success: false, error: e.message || "Firebase Error" };
    }
  },

  // READ (All)
  async getAllLinks(): Promise<ApiResponse<ShortLink[]>> {
    if (!db) return { success: false, error: 'Database not configured' };

    try {
        const q = query(collection(db, "links"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const list: ShortLink[] = [];
        querySnapshot.forEach((doc) => {
            list.push(doc.data() as ShortLink);
        });
        return { success: true, data: list };
    } catch (e: any) {
        console.error("Firebase List Error", e);
        return { success: false, error: e.message };
    }
  },

  // READ (One - for Redirect)
  async getLink(slug: string): Promise<ApiResponse<ShortLink>> {
    if (!db) return { success: false, error: 'Database not configured' };

    try {
        const docRef = doc(db, "links", slug);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { success: true, data: docSnap.data() as ShortLink };
        } else {
            return { success: false, error: 'Link not found' };
        }
    } catch (e: any) {
        return { success: false, error: e.message };
    }
  },

  // UPDATE (Increment Click)
  async incrementClicks(slug: string): Promise<void> {
    if (!db) return;

    try {
        const docRef = doc(db, "links", slug);
        await updateDoc(docRef, {
            clicks: increment(1)
        });
    } catch (e) {
        console.error("Failed to increment firebase click", e);
    }
  },

  // DELETE
  async deleteLink(slug: string): Promise<ApiResponse<boolean>> {
    if (!db) return { success: false, error: 'Database not configured' };
    
    try {
        await deleteDoc(doc(db, "links", slug));
        return { success: true, data: true };
    } catch (e: any) {
            return { success: false, error: e.message };
    }
  }
};