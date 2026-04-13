import { Component } from '@angular/core';
import { CompareRequest, ConfigeDB } from 'src/app/Models/ConfigeDb';
import { CompreDBService } from 'src/app/services/compreDB.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableComponent } from '../table/table.component';

// =====================================================
// ✅ COMPARE STATUS TYPE
// =====================================================
type CompareStatus = 'idle' | 'no-diff' | 'has-diff' | 'error';

@Component({
  selector: 'app-compre-db',
  standalone: true,
  imports: [FormsModule, CommonModule, TableComponent],
  templateUrl: './compre-db.component.html',
  styleUrl: './compre-db.component.css'
})
export class CompreDBComponent {


  constructor(private service: CompreDBService) {}

  // ===================== RESULT =====================
  result: any = {
    tables: [],
    columns: {},
    data: {},
    types: {},
    functions: {},
    procedures: {},
    triggers: {}
  };

  // ===================== DEBUG =====================
  debug = true;

  log(title: string, data: any) {
    if (this.debug) {
      console.log(`🔍 ${title}:`, data);
    }
  }

  // ===================== DB CONFIG =====================
  db1: ConfigeDB = { host: '', port: '', databaseName: '', user: '', password: '' };
  db2: ConfigeDB = { host: '', port: '', databaseName: '', user: '', password: '' };

  TypeChek = {
    columns:    false,
    data:       false,
    tables:     false,
    types:      false,
    functions:  false,
    procedures: false,
    triggers:   false
  };

  // ===================== STATUS PER SECTION =====================
  tableStatus:      CompareStatus = 'idle';
  columnsStatus:    CompareStatus = 'idle';
  dataStatus:       CompareStatus = 'idle';
  typesStatus:      CompareStatus = 'idle';
  functionsStatus:  CompareStatus = 'idle';
  proceduresStatus: CompareStatus = 'idle';
  triggersStatus:   CompareStatus = 'idle';

  // ===================== ROWS =====================
  typesRows:      any[] = [];
  columnsRows:    any[] = [];
  dataRows:       any[] = [];
  tablesRows:     any[] = [];
  functionsRows:  any[] = [];
  proceduresRows: any[] = [];
  triggersRows:   any[] = [];

  // =====================================================
  // ✅ UNIVERSAL "NO DIFFERENCE" DETECTOR
  // Handles: plain string, string[], { [table]: string[] }
  // =====================================================
  private NO_DIFF_PATTERNS: RegExp[] = [
    /no differences found/i,
    /no column differences found/i,
    /no data differences found/i,
    /no type differences found/i,
    /no function differences found/i,
    /no procedure differences found/i,
    /no trigger differences found/i,
    /function output differs:/i,
  ];

  isNoDiffMessage(value: unknown): boolean {

    // Case 1: plain string
    if (typeof value === 'string') {
      return this.NO_DIFF_PATTERNS.some(p => p.test(value));
    }

    // Case 2: string array  (e.g. tables endpoint)
    if (Array.isArray(value)) {
      return (
        value.length === 0 ||
        (value.length === 1 &&
          typeof value[0] === 'string' &&
          this.NO_DIFF_PATTERNS.some(p => p.test(value[0])))
      );
    }

    // Case 3: object map  { tableName: string[] }
    if (typeof value === 'object' && value !== null) {
      const entries = Object.values(value as Record<string, unknown>);
      if (entries.length === 0) return true;

      if (entries.every(v => Array.isArray(v) && (v as any[]).length === 0)) return true;

      if (
        entries.every(
          v =>
            typeof v === 'string' &&
            this.NO_DIFF_PATTERNS.some(p => p.test(v as string))
        )
      ) return true;
    }

    return false;
  }


  parseDataDiff(row: string): { row: number; column: string; d1: string | null; d2: string | null } | null {

    const match = row.match(/Row\s*(\d+),\s*column\s*(.+?)\s*differs:\s*(.*)/i);
    if (!match) return null;

    const rowNum = Number(match[1]);
    const column = match[2].trim();
    const rest   = match[3];

    // Strips "anyDbName=" prefix — works for any database name
    const extractVal = (s: string): string | null => {
      if (!s) return null;
      const val = s.replace(/^[^=]+=\s*/, '').trim();
      return val === 'null' ? null : val || null;
    };

    const [side1, side2] = rest.split(/\s*\|\s*/);

    return {
      row:    rowNum,
      column,
      d1:     extractVal(side1),
      d2:     extractVal(side2),
    };
  }

  // =====================================================
  // 🔥 TABLES BUILDER
  // =====================================================
  buildtable(): any[] {

    const rows   = this.result.tables || [];
    const result: any[] = [];

    this.log('RAW tables', rows);

    for (const row of rows) {

      if (typeof row !== 'string') continue;
const match = row.match(/Tables missing in (\S+):\s*(.+)/i);
if (!match) continue;

const detectedDb = match[1].trim();
const tableName  = match[2].trim();
const isDb1      = detectedDb.toLowerCase() === this.db1.databaseName.toLowerCase();

result.push({
  table: tableName,
  d1:    isDb1  ? '❌ Missing' : '✅ Exists',
  d2:    !isDb1 ? '❌ Missing' : '✅ Exists',
});
    }

    return result;
  }

  // =====================================================
  // 🔥 GENERIC BUILDER — fully dynamic db name handling
  // =====================================================
  buildtableRows(type: 'types' | 'columns' | 'data'): any[] {

    const source = this.result?.[type];
    const result: any[] = [];

    this.log(`RAW ${type}`, source);
    if (!source) return [];

    // Strips "anyDbName=" prefix from a value string
    const extractVal = (s: string): string =>
      s?.replace(/^[^=]+=\s*/, '').trim() ?? '';

    for (const table in source) {

      for (const row of source[table]) {

        if (typeof row !== 'string') continue;

        // ================= TYPES =================
        if (type === 'types') {

          const parts = row.split('=>');
          if (parts.length !== 2) continue;

          const column       = parts[0].replace(/column/i, '').trim();
          const [raw1, raw2] = parts[1].split(/\s*\|\s*/);

          result.push({
            table,
            column,
            d1: extractVal(raw1),
            d2: extractVal(raw2),
          });
        }

        // ================= COLUMNS =================
        else if (type === 'columns') {

          // Captures ANY identifier after "only in" — not just d1/d2
          const match = row.match(/column exists only in (\S+):\s*(.+)/i);
          if (!match) continue;

          const detectedDb = match[1].trim();
          const isDb1      = detectedDb.toLowerCase() === this.db1.databaseName.toLowerCase();

          result.push({
            table,
            column: match[2].trim(),
            d1:     isDb1  ? '❌ Missing' : '✅ Exists',
            d2:     !isDb1 ? '❌ Missing' : '✅ Exists',
            onlyIn: isDb1
           ? `${this.db2.databaseName} only`
           : `${this.db1.databaseName} only`
          });
        }

        // ================= DATA =================
        else if (type === 'data') {

          const parsed = this.parseDataDiff(row);
          if (parsed) result.push({ table, ...parsed });
        }
      }
    }

    return result;
  }

 
  runCompre() {

    const payload: CompareRequest = { db1: this.db1, db2: this.db2 };

    this.log('PAYLOAD',    payload);
    this.log('TYPE CHECK', this.TypeChek);

    // ================= TABLES =================
    if (this.TypeChek.tables) {

      this.service.compareTables(payload).subscribe({
        next: (res) => {

          if (this.isNoDiffMessage(res)) {
            this.tableStatus = 'no-diff';
            this.tablesRows  = [];
            this.log('TABLES', 'No differences');
            return;
          }

          this.result.tables = res || [];
          this.tablesRows    = this.buildtable();
          this.tableStatus   = this.tablesRows.length ? 'has-diff' : 'no-diff';
          console.log( this.result.tables)
          console.log('TABLES PARSED', this.tablesRows);
          console.log('TABLES PARSED', this.tableStatus);
        },
        error: (err) => {
          console.error('❌ tables error:', err);
          this.tableStatus = 'error';
        }
      });
    }

    // ================= DATA =================
    if (this.TypeChek.data) {

      this.service.compareData(payload).subscribe({
        next: (res) => {

          if (this.isNoDiffMessage(res)) {
            this.dataStatus = 'no-diff';
            this.dataRows   = [];
            this.log('DATA', 'No differences');
            return;
          }

          this.result.data = res || {};
          this.dataRows    = this.buildtableRows('data');
          this.dataStatus  = this.dataRows.length ? 'has-diff' : 'no-diff';
          this.log('DATA PARSED', this.dataRows);
        },
        error: (err) => {
          console.error('❌ data error:', err);
          this.dataStatus = 'error';
        }
      });
    }

    // ================= TYPES =================
    if (this.TypeChek.types) {

      this.service.compareTypes(payload).subscribe({
        next: (res) => {

          if (this.isNoDiffMessage(res)) {
            this.typesStatus = 'no-diff';
            this.typesRows   = [];
            this.log('TYPES', 'No differences');
            return;
          }

          this.result.types = res || {};
          this.typesRows    = this.buildtableRows('types');
          this.typesStatus  = this.typesRows.length ? 'has-diff' : 'no-diff';
          this.log('TYPES PARSED', this.typesRows);
        },
        error: (err) => {
          console.error('❌ types error:', err);
          this.typesStatus = 'error';
        }
      });
    }

    // ================= COLUMNS =================
    if (this.TypeChek.columns) {

      this.service.compareColumns(payload).subscribe({
        next: (res) => {

          if (this.isNoDiffMessage(res)) {
            this.columnsStatus = 'no-diff';
            this.columnsRows   = [];
            this.log('COLUMNS', 'No differences');
            return;
          }

          this.result.columns = res || {};
          this.columnsRows    = this.buildtableRows('columns');
          this.columnsStatus  = this.columnsRows.length ? 'has-diff' : 'no-diff';
          this.log('COLUMNS PARSED', this.columnsRows);
        },
        error: (err) => {
          console.error('❌ columns error:', err);
          this.columnsStatus = 'error';
        }
      });
    }

    // ================= FUNCTIONS =================
    if (this.TypeChek.functions) {

      this.service.compareFunctions(payload).subscribe({
        next: (res) => {

          if (this.isNoDiffMessage(res)) {
            this.functionsStatus  = 'no-diff';
            this.result.functions = {};
            this.log('FUNCTIONS', 'No differences');
            return;
          }

          this.result.functions = res || {};
          this.functionsStatus  = 'has-diff';
          this.log('FUNCTIONS', res);
        },
        error: (err) => {
          console.error('❌ functions error:', err);
          this.functionsStatus = 'error';
        }
      });
    }

    // ================= PROCEDURES =================
    if (this.TypeChek.procedures) {

      this.service.compareProcedures(payload).subscribe({
        next: (res) => {

          if (this.isNoDiffMessage(res)) {
            this.proceduresStatus  = 'no-diff';
            this.result.procedures = {};
            this.log('PROCEDURES', 'No differences');
            return;
          }

          this.result.procedures = res || {};
          this.proceduresStatus  = 'has-diff';
          this.log('PROCEDURES', res);
        },
        error: (err) => {
          console.error('❌ procedures error:', err);
          this.proceduresStatus = 'error';
        }
      });
    }

    // ================= TRIGGERS =================
    if (this.TypeChek.triggers) {

      this.service.compareTriggers(payload).subscribe({
        next: (res) => {

          if (this.isNoDiffMessage(res)) {
            this.triggersStatus  = 'no-diff';
            this.result.triggers = {};
            this.log('TRIGGERS', 'No differences');
            return;
          }

          this.result.triggers = res || {};
          this.triggersStatus  = 'has-diff';
          this.log('TRIGGERS', res);
        },
        error: (err) => {
          console.error('❌ triggers error:', err);
          this.triggersStatus = 'error';
        }
      });
    }
  }
}