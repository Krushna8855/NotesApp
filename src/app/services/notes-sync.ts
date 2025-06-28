import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  Timestamp,
} from '@angular/fire/firestore';
import { Note } from '../models/note.model';
import { Auth } from '@angular/fire/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { docData } from 'rxfire/firestore';
import { NotesStore } from '../stores/notes.store';

@Injectable({ providedIn: 'root' })
export class NotesSyncService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private store = inject(NotesStore);

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.listenToRemoteNotes(user.uid);
      }
    });
  }

  private listenToRemoteNotes(uid: string) {
    const notesRef = collection(this.firestore, `users/${uid}/notes`);
    onSnapshot(notesRef, (snapshot) => {
      const remoteNotes: Note[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as Note;
        remoteNotes.push({ ...data, id: doc.id });
      });

      this.mergeRemoteNotes(remoteNotes);
    });
  }

  private mergeRemoteNotes(remoteNotes: Note[]) {
    const localNotes = this.store.allNotes();
    const merged: Note[] = [];

    for (const remote of remoteNotes) {
      const local = localNotes.find((n) => n.id === remote.id);
      if (!local || remote.version > local.version) {
        merged.push(remote);
      } else if (remote.version < local.version) {
        this.pushNoteToFirestore(local); // Push local version
      } else {
        merged.push(local); // Same version
      }
    }

    this.store.setNotes(merged);
  }

  async pushNoteToFirestore(note: Note) {
    const user = this.auth.currentUser;
    if (!user) return;

    const noteRef = doc(this.firestore, `users/${user.uid}/notes/${note.id}`);
    await setDoc(noteRef, {
      ...note,
      updatedAt: Timestamp.now(),
    });
  }

  async deleteNoteFromFirestore(id: string) {
    const user = this.auth.currentUser;
    if (!user) return;

    const noteRef = doc(this.firestore, `users/${user.uid}/notes/${id}`);
    await deleteDoc(noteRef);
  }
}
