import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-card-data-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './card-data-dialog.component.html',
  styleUrl: './card-data-dialog.component.scss'
})
export class CardDataDialogComponent {

  title = '';
  dataCard: any[] = [];   // initialized
  total = 0;

  constructor(
    public dialogRef: MatDialogRef<CardDataDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.title = data.title;
    this.dataCard = data.items ?? []; // extra safety
    this.total = data.total ?? 0;
  }

  close() {
    this.dialogRef.close();
  }

}
