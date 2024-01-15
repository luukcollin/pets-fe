import { Pet } from 'src/models/api';

export interface PetsStateModel {
  allPets: Pet[];
  availablePets: Pet[];
  pendingPets: Pet[];
  soldPets: Pet[];
  filterQ: string;
}
