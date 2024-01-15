import { Pet } from './pet.model';

export interface TableData {
  columns: string[];
  rows: Pet[];
}

export interface Column {
  key: string;
  label: string;
}
