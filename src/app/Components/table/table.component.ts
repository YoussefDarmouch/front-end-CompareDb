import { Component, Input } from '@angular/core';
import { NgFor,NgIf, } from '@angular/common';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [NgFor,NgIf,NgClass],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {
   @Input() typesRows: any[] = [];
   @Input() columnsRows: any[] = [];
   @Input() dataRows: any[] = [];
   @Input() tablesRows: any[] = [];
   @Input() functionsRows: any[] = [];
   @Input() proceduresRows: any[] = [];
   @Input() triggersRows: any[] = [];
   @Input() db1: string ="";
   @Input() db2: string ="";



}
