import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Note } from '../../models/note.model';
import { NotesStore } from '../../stores/notes.store';

@Component({
  selector: 'app-note-item',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./note-item.scss'],
  templateUrl: './note-item.html',
})
export class NoteItemComponent {
  @Input() note!: Note;
  @Output() edit = new EventEmitter<Note>();
  @Output() delete = new EventEmitter<string>();

  get updatedDate(): Date {
  return this.note.updatedAt instanceof Date
    ? this.note.updatedAt
    : this.note.updatedAt.toDate(); // Firestore Timestamp to JS Date
}
constructor (private noteStore : NotesStore){

}

}
