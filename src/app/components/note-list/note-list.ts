import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Note } from '../../models/note.model';
import { NoteItemComponent } from '../note-item/note-item';

@Component({
  selector: 'app-note-list',
  standalone: true,
  imports: [CommonModule, NoteItemComponent],
  styleUrls: ['./note-list.scss'],
  templateUrl:'./note-list.html',
})
export class NoteListComponent {
  @Input() notes: Note[] = [];
  @Output() edit = new EventEmitter<Note>();
  @Output() delete = new EventEmitter<string>();
}
