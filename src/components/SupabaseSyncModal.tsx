import React, { useState } from 'react';
import { 
  Database, 
  X, 
  CheckCircle2, 
  RefreshCw, 
  Layers, 
  Radio, 
  ExternalLink,
  ShieldCheck,
  Server
} from 'lucide-react';
import { getSupabaseConfig, updateSupabaseConfig } from '../services/supabaseClient';
import { UserProgress } from '../types/disease';

interface SupabaseSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProgress: UserProgress;
  onForceSync: () => void;
}

export const SupabaseSyncModal: React.FC<SupabaseSyncModalProps> = ({
  isOpen,
  onClose,
  userProgress,
  onForceSync
}) => {
  const currentConfig = getSupabaseConfig();
  const [supabaseUrl, setSupabaseUrl] = useState<string>(currentConfig.url || '');
  const [anonKey, setAnonKey] = useState<string>(currentConfig.anonKey || '');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const success = updateSupabaseConfig(supabaseUrl, anonKey);
    if (success) {
      setStatusMessage('✓ Supabase credentials configured successfully. Realtime listeners activated.');
    } else {
      setStatusMessage('✓ Switched to Local-First multi-tab Realtime Broadcast channel.');
    }
    setTimeout(() => {
      onForceSync();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>Real-Time User Progress Sync</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                  Supabase Powered
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Synchronize flashcard reviews, mastered topics, and study streaks
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sync Status Banner */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">Connection Mode:</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {currentConfig.isConnected ? 'Supabase Live Connected' : 'Local-First + Multi-Tab Broadcast Sync'}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">Active Flashcards in Deck:</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">
              {userProgress.flashcards.length} cards
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">Last Synced:</span>
            <span className="font-mono text-slate-600 dark:text-slate-400 text-[11px]">
              {new Date(userProgress.syncTimestamp).toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Supabase Configuration Form */}
        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Supabase Project URL (Optional):
            </label>
            <input
              type="text"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              placeholder="https://xyzcompany.supabase.co"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Supabase Anon Public API Key (Optional):
            </label>
            <input
              type="password"
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
            />
          </div>

          {statusMessage && (
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              {statusMessage}
            </p>
          )}

          <div className="flex justify-between items-center pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onForceSync}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Force Sync Now</span>
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700"
              >
                Close
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-xs"
              >
                Save Settings
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
