import { Pet } from 'src/models/api';

export interface PetsStateModel {
  availablePets: Pet[];
  pendingPets: Pet[];
  soldPets: Pet[];
  filterQ: string;
}
