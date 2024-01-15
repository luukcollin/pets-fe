import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Pet } from 'src/models/pet.model';
import { Column } from 'src/models/table.model';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {

  private _rows: Pet[] = [];

  @Input()
  set rows(value: Pet[] | null){
    if(value === null) return;
    this._rows = value;
  }

  get rows(): Pet[] {
    return this._rows;
  }
 

  @Input()
  columns: Column[] = [];

  @Input()
  selectedRow: Pet | undefined = undefined;

  @Output()
  clickedPet = new EventEmitter<Pet>();

  @Output()
  removePet = new EventEmitter<number>();


  private sortingConfig = { key: "id", order: "desc" }

  onRowClick(row: Pet) {
    this.clickedPet.emit(row)
  }

  onHeaderClick(headerKey: string) {
    this.updateSortPreference(headerKey);


  }

  updateSortingConfig(columnKey: string) {
    this.sortingConfig.order = reverseOrder(this.sortingConfig.order);
    this.sortingConfig.key = columnKey;
  }

  getRowEntryClassName(id: number) {
    const baseClassname = "row-entry "
    return this.selectedRow?.id === id ? baseClassname + "selected" : baseClassname;
  }


  removeRow(id: number) {
    this.removePet.emit(id)
  }

  compareFn(a: Pet, b: Pet) {
    const key = this.sortingConfig.key as keyof Pet;
    const orderReverse = this.sortingConfig.order === "asc" ? 1 : -1;
    const subjectA = a[key] as string;
    const subjectB = b[key] as string;
    if (subjectA < subjectB) {
      return 1 * orderReverse;
    }
    if (subjectA > subjectB) {
      return -1 * orderReverse;
    }
    return 0;
  }

  updateSortPreference(keyChange: string) {
    this.updateSortingConfig(keyChange);
    this.sort()
  }

  sort() {
    console.log(this.sortingConfig)

    this.rows = this.rows.sort((a, b) => this.compareFn(a, b));


  }
}

function reverseOrder(order: string) {
  return order === "asc" ? "desc" : "asc"

}

