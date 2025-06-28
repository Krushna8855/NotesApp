import { Injectable, computed, signal, inject, effect } from '@angular/core';
import { Note } from '../models/note.model';
import { Firestore, collection, getDocs, onSnapshot } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { AuthService } from '../services/auth.service';
@Injectable({ providedIn: 'root' })
export class NotesStore {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private authService  = inject(AuthService);

  private notes = signal<Note[]>([]);
  private syncing = signal(false);
  private conflicts = signal<Record<string, Note>>({});

  // Undo/Redo stacks
  private history = signal<Note[][]>([]);
  private future = signal<Note[][]>([]);

  readonly allNotes = computed(() => this.notes());
  readonly isSyncing = computed(() => this.syncing());
  readonly conflictNotes = computed(() => Object.values(this.conflicts()));

  constructor() {
   effect(() => {
    const user = this.authService.user();
    if (user) {
      console.log('✅ User logged in:', user.uid);
      this.setupOnlineOfflineListener();
      this.listenToRemoteNotes();
    }
  });

  }

  private get userId(): string {
  const user = this.authService.user();
  if (!user) throw new Error('User not signed in!');
  return user.uid;
}

private get notesRef() {
  return collection(this.firestore, 'users', this.userId, 'notes');
}


  // Core actions
  addNote(note: Note) {
    this.commit();
    this.notes.update((notes) => [...notes, note]);
  }

  updateNote(updated: Note) {
    this.commit();
    this.notes.update((notes) =>
      notes.map((n) => (n.id === updated.id ? updated : n))
    );
  }

  deleteNote(id: string) {
    this.commit();
    this.notes.update((notes) => notes.filter((n) => n.id !== id));
  }

  setNotes(notes: Note[]) {
    this.notes.set(notes);
  }

  setSyncing(status: boolean) {
    this.syncing.set(status);
  }

  setConflict(note: Note) {
    this.conflicts.update((c) => ({ ...c, [note.id]: note }));
  }

  clearConflict(id: string) {
    this.conflicts.update((c) => {
      const { [id]: _, ...rest } = c;
      return rest;
    });
  }

  // Undo/Redo
  commit() {
    this.history.update((h) => [...h, this.notes()]);
    this.future.set([]); // Clear redo stack
  }

  undo() {
    const h = this.history();
    if (h.length === 0) return;

    const prev = h[h.length - 1];
    this.future.update((f) => [this.notes(), ...f]);
    this.notes.set(prev);
    this.history.update((h) => h.slice(0, -1));
  }

  redo() {
    const f = this.future();
    if (f.length === 0) return;

    const next = f[0];
    this.history.update((h) => [...h, this.notes()]);
    this.notes.set(next);
    this.future.update((f) => f.slice(1));
  }

 private listenToRemoteNotes() {
  onSnapshot(this.notesRef, (snapshot) => {
    const serverNotes = snapshot.docs.map((doc) => doc.data() as Note);
    this.reconcileNotes(serverNotes);
  });
}

private async manualSync() {
  const snapshot = await getDocs(this.notesRef);
  const serverNotes = snapshot.docs.map((doc) => doc.data() as Note);
  this.reconcileNotes(serverNotes);
}

private reconcileNotes(serverNotes: Note[]) {
  const localNotes = this.notes();

  console.log('🧠 Reconciling notes...');
  console.log('Local Notes:', localNotes);
  console.log('Server Notes:', serverNotes);

  const updatedNotes = localNotes.map(localNote => {
    const serverNote = serverNotes.find(s => s.id === localNote.id);

    if (!serverNote) {
      // No remote version, keep local
      return localNote;
    }

    if (serverNote.version > localNote.version) {
      // Remote is newer, accept remote
      return serverNote;
    }

    if (serverNote.version < localNote.version) {
      // Local is newer, keep local
      return localNote;
    }

    // Same version but content differs => conflict
    const conflict = serverNote.title !== localNote.title || serverNote.content !== localNote.content;
    if (conflict) {
      console.warn('⚠️ Conflict detected for note:', serverNote);
      this.setConflict(serverNote);
      return localNote; // Keep local for now, notify conflict
    }

    // No changes
    return localNote;
  });

  // Add any new notes from server that don't exist locally
  const newNotes = serverNotes.filter(
    s => !localNotes.find(l => l.id === s.id)
  );

  this.setNotes([...updatedNotes, ...newNotes]);
}


  private setupOnlineOfflineListener() {
    window.addEventListener('online', () => {
      console.log('🔌 Online – syncing...');
      this.setSyncing(true);
      this.manualSync();
      setTimeout(() => this.setSyncing(false), 2000);
    });

    window.addEventListener('offline', () => {
      console.log('📴 Offline');
      this.setSyncing(false);
    });
  }

}