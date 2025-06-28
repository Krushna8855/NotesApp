import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Note } from '../../models/note.model';

@Component({
  selector: 'app-note-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./note-editor.scss'],
  templateUrl:'./note-editor.html',
})
export class NoteEditorComponent {
  @Input() note: Note = { id: '', title: '', content: '', updatedAt: new Date(), version: 0 };
  @Output() save = new EventEmitter<Note>();
  @Output() cancel = new EventEmitter<void>();

  saveNote() {
    this.note.updatedAt = new Date();
    this.note.version += 1;
    this.save.emit(this.note);
  }
}
