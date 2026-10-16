import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Flashcard, UserProgress } from '../types/disease';

const PROGRESS_STORAGE_KEY = 'medvindicate_student_progress_v1';
const SUPABASE_CONFIG_KEY = 'medvindicate_supabase_credentials';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
  isCustom: boolean;
}

// Default initial state
const defaultProgress: UserProgress = {
  userId: 'med-student-local',
  completedDiseaseIds: ['acute-appendicitis'],
  bookmarkedDiseaseIds: ['type-2-diabetes'],
  flashcards: [
    {
      id: 'default-fc-1',
      diseaseId: 'acute-appendicitis',
      diseaseName: 'Acute Appendicitis',
      front: 'What is the pathognomonic histopathologic finding required to establish acute appendicitis?',
      back: 'Transmural active neutrophilic (PMN) infiltration into the muscularis propria. Luminal pus alone without muscularis propria invasion is insufficient.',
      category: 'Cellular',
      level: '1st-year',
      tags: ['Histopathology', 'Pathology', 'High-Yield'],
      createdAt: Date.now() - 86400000,
      reviewCount: 2,
      intervalDays: 3,
      easeFactor: 2.5
    },
    {
      id: 'default-fc-2',
      diseaseId: 'acute-appendicitis',
      diseaseName: 'Acute Appendicitis',
      front: 'Why does early appendicitis pain refer to the periumbilical region (T10), while late pain shifts to McBurney\'s point?',
      back: 'Early pain is visceral, conducted by unmyelinated C-fibers via sympathetic splanchnic nerves to T10. Late pain is somatic, resulting from inflammatory contact with the parietal peritoneum innervated by somatic spinal nerves (T11-L1).',
      category: 'Clinical',
      level: '1st-year',
      tags: ['Anatomy', 'Neuroanatomy', 'Dermatomes'],
      createdAt: Date.now() - 72000000,
      reviewCount: 3,
      intervalDays: 4,
      easeFactor: 2.6
    },
    {
      id: 'default-fc-3',
      diseaseId: 'type-2-diabetes',
      diseaseName: 'Type 2 Diabetes Mellitus',
      front: 'What is the cardiorenal hemodynamic mechanism of SGLT2 inhibitors in diabetic nephropathy?',
      back: 'By inhibiting proximal SGLT2, more sodium reaches the macula densa, restoring tubuloglomerular feedback. This causes afferent arteriolar vasoconstriction, lowering intraglomerular capillary hypertension and preserving GFR long-term.',
      category: 'Pharmacology',
      level: '4th-year',
      tags: ['Pharmacology', 'Renal', 'ADA Guidelines'],
      createdAt: Date.now() - 36000000,
      reviewCount: 1,
      intervalDays: 2,
      easeFactor: 2.4
    }
  ],
  totalFlashcardsReviewed: 14,
  lastActive: Date.now(),
  syncTimestamp: Date.now()
};

let supabaseClient: SupabaseClient | null = null;
const broadcastChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window 
  ? new BroadcastChannel('medvindicate_realtime_sync') 
  : null;

const syncListeners: ((progress: UserProgress) => void)[] = [];

// Initialize saved config
export function getSupabaseConfig(): SupabaseConfig {
  if (typeof window === 'undefined') {
    return { url: '', anonKey: '', isConnected: false, isCustom: false };
  }
  
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

  try {
    const saved = localStorage.getItem(SUPABASE_CONFIG_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.url && parsed.anonKey) {
        return {
          url: parsed.url,
          anonKey: parsed.anonKey,
          isConnected: true,
          isCustom: true
        };
      }
    }
  } catch (e) {
    console.error('Error reading saved Supabase config:', e);
  }

  if (envUrl && envKey) {
    return {
      url: envUrl,
      anonKey: envKey,
      isConnected: true,
      isCustom: false
    };
  }

  return {
    url: '',
    anonKey: '',
    isConnected: false,
    isCustom: false
  };
}

export function initSupabaseClient(): SupabaseClient | null {
  const config = getSupabaseConfig();
  if (config.url && config.anonKey) {
    try {
      supabaseClient = createClient(config.url, config.anonKey, {
        auth: { persistSession: true },
        realtime: { params: { eventsPerSecond: 10 } }
      });
      return supabaseClient;
    } catch (err) {
      console.warn('Failed to init real Supabase client:', err);
    }
  }
  supabaseClient = null;
  return null;
}

// Progress Loading
export function loadLocalProgress(): UserProgress {
  if (typeof window === 'undefined') return defaultProgress;
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...defaultProgress,
        ...parsed,
        flashcards: parsed.flashcards?.length ? parsed.flashcards : defaultProgress.flashcards
      };
    }
  } catch (e) {
    console.error('Failed to load local progress:', e);
  }
  return defaultProgress;
}

// Progress Saving & Real-time propagation
export function saveProgress(updated: UserProgress) {
  const stamped: UserProgress = {
    ...updated,
    lastActive: Date.now(),
    syncTimestamp: Date.now()
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(stamped));
  }

  // Notify in-process listeners
  syncListeners.forEach(listener => listener(stamped));

  // Notify other browser tabs via BroadcastChannel (local real-time sync)
  if (broadcastChannel) {
    broadcastChannel.postMessage({ type: 'PROGRESS_SYNC', data: stamped });
  }

  // If live Supabase client exists, sync upstream
  if (supabaseClient) {
    syncUpstreamToSupabase(stamped).catch(err => {
      console.warn('Upstream Supabase sync skipped:', err);
    });
  }

  return stamped;
}

async function syncUpstreamToSupabase(progress: UserProgress) {
  if (!supabaseClient) return;
  try {
    // Attempt upsert into user_progress table if configured in project
    await supabaseClient
      .from('user_progress')
      .upsert({
        user_id: progress.userId,
        data: progress,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
  } catch (err) {
    // Graceful fallback for demo projects without table
    console.debug('Supabase table upsert info:', err);
  }
}

// Listener subscription
export function subscribeToProgress(callback: (progress: UserProgress) => void) {
  syncListeners.push(callback);

  // Setup broadcast message handler
  if (broadcastChannel) {
    broadcastChannel.onmessage = (event) => {
      if (event.data?.type === 'PROGRESS_SYNC' && event.data.data) {
        const incoming = event.data.data as UserProgress;
        if (typeof window !== 'undefined') {
          localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(incoming));
        }
        syncListeners.forEach(fn => fn(incoming));
      }
    };
  }

  return () => {
    const idx = syncListeners.indexOf(callback);
    if (idx !== -1) syncListeners.splice(idx, 1);
  };
}

// Convenience Operations
export function addFlashcard(card: Omit<Flashcard, 'id' | 'createdAt'>): Flashcard {
  const current = loadLocalProgress();
  const newCard: Flashcard = {
    ...card,
    id: 'fc-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    createdAt: Date.now(),
    intervalDays: 1,
    easeFactor: 2.5,
    reviewCount: 0
  };

  const updated: UserProgress = {
    ...current,
    flashcards: [newCard, ...current.flashcards]
  };

  saveProgress(updated);
  return newCard;
}

export function removeFlashcard(id: string): void {
  const current = loadLocalProgress();
  const updated: UserProgress = {
    ...current,
    flashcards: current.flashcards.filter((c: Flashcard) => c.id !== id)
  };
  saveProgress(updated);
}

export function reviewFlashcard(id: string, rating: 'again' | 'hard' | 'good' | 'easy'): void {
  const current = loadLocalProgress();
  const updatedCards = current.flashcards.map((card: Flashcard) => {
    if (card.id !== id) return card;

    let interval = card.intervalDays || 1;
    let ease = card.easeFactor || 2.5;
    const count = (card.reviewCount || 0) + 1;

    if (rating === 'again') {
      interval = 1;
      ease = Math.max(1.3, ease - 0.2);
    } else if (rating === 'hard') {
      interval = Math.max(1, Math.round(interval * 1.2));
      ease = Math.max(1.3, ease - 0.15);
    } else if (rating === 'good') {
      interval = Math.round(interval * ease);
    } else if (rating === 'easy') {
      interval = Math.round(interval * ease * 1.3);
      ease += 0.15;
    }

    return {
      ...card,
      reviewCount: count,
      intervalDays: interval,
      easeFactor: ease,
      nextReviewAt: Date.now() + interval * 86400000
    };
  });

  saveProgress({
    ...current,
    flashcards: updatedCards,
    totalFlashcardsReviewed: current.totalFlashcardsReviewed + 1
  });
}

export function toggleBookmark(diseaseId: string): boolean {
  const current = loadLocalProgress();
  const isBookmarked = current.bookmarkedDiseaseIds.includes(diseaseId);
  const updatedList = isBookmarked
    ? current.bookmarkedDiseaseIds.filter((id: string) => id !== diseaseId)
    : [...current.bookmarkedDiseaseIds, diseaseId];

  saveProgress({
    ...current,
    bookmarkedDiseaseIds: updatedList
  });

  return !isBookmarked;
}

export function toggleCompletion(diseaseId: string): boolean {
  const current = loadLocalProgress();
  const isCompleted = current.completedDiseaseIds.includes(diseaseId);
  const updatedList = isCompleted
    ? current.completedDiseaseIds.filter((id: string) => id !== diseaseId)
    : [...current.completedDiseaseIds, diseaseId];

  saveProgress({
    ...current,
    completedDiseaseIds: updatedList
  });

  return !isCompleted;
}

export function updateSupabaseConfig(url: string, anonKey: string): boolean {
  try {
    if (!url.trim() || !anonKey.trim()) {
      localStorage.removeItem(SUPABASE_CONFIG_KEY);
      supabaseClient = null;
      return false;
    }

    const payload = { url: url.trim(), anonKey: anonKey.trim() };
    localStorage.setItem(SUPABASE_CONFIG_KEY, JSON.stringify(payload));
    initSupabaseClient();
    return true;
  } catch (e) {
    console.error('Error saving Supabase settings:', e);
    return false;
  }
}
