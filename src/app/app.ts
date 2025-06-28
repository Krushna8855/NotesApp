import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Note } from './models/note.model';
import { NoteEditorComponent } from './components/note-editor/note-editor';
import { NoteListComponent } from './components/note-list/note-list';
import { SyncStatusComponent } from './components/sync-status/sync-status';
import { NotesStore } from './stores/notes.store';
import { v4 as uuidv4 } from 'uuid';
import { NotesSyncService } from './services/notes-sync';
import { AuthService } from './services/auth.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NoteListComponent, NoteEditorComponent, SyncStatusComponent],
  templateUrl:'./app.html',
  styleUrl : './app.scss'
})
export class App {
  editingNote = signal<Note | null>(null);

  constructor(private authS: AuthService, public store: NotesStore, private syncService: NotesSyncService
) {}

  startNewNote() {
    this.editingNote.set({
      id: uuidv4(),
      title: '',
      content: '',
      updatedAt: new Date(),
      version: 0,
    });
  }

  editNote(note: Note) {
    this.editingNote.set({ ...note });
  }

  saveNote(note: Note) {
    const existing = this.store.allNotes().find(n => n.id === note.id);
    if (existing) {
      this.store.updateNote(note);
    } else {
      this.store.addNote(note);
    }
    this.syncService.pushNoteToFirestore(note);
    this.editingNote.set(null);
  }

 deleteNote(id: string) {
  const confirmed = confirm('Are you sure you want to delete this note?');
  if (confirmed) {
    this.store.deleteNote(id);
    this.syncService.deleteNoteFromFirestore(id);
  }
}
  cancelEdit() {
    this.editingNote.set(null);
  }
  undo() {
  this.store.undo();
}

redo() {
  this.store.redo();
}

acceptRemote(note: Note) {
  this.store.updateNote(note);         // Replace with server version
  this.store.clearConflict(note.id);   // Clear from conflict map
}

keepLocal(id: string) {
  this.store.clearConflict(id);        // Ignore server version
}


}
