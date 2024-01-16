import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, StateToken } from '@ngxs/store';
import { Pet } from 'src/models/api';
import { PetsActions } from './pets.actions';
import { PetsStateModel } from './pets.state.model';

const PET_STATE_TOKEN = new StateToken<PetsStateModel>('pets');

@Injectable()
@State<PetsStateModel>({
  name: PET_STATE_TOKEN,
  defaults: {
    availablePets: [],
    pendingPets: [],
    soldPets: [],
    filterQ: 'available',
  },
})
export class PetsState {
  @Selector()
  static allPets({
    availablePets,
    pendingPets,
    soldPets,
  }: PetsStateModel): Pet[] {
    return [...availablePets, ...pendingPets, ...soldPets];
  }

  @Selector()
  static availablePets({ availablePets }: PetsStateModel): Pet[] {
    return availablePets;
  }

  @Selector()
  static soldPets({ soldPets }: PetsStateModel): Pet[] {
    return soldPets;
  }

  @Selector()
  static pendingPets({ pendingPets }: PetsStateModel): Pet[] {
    return pendingPets;
  }

  @Selector()
  static filterQ({ filterQ }: PetsStateModel): string {
    return filterQ;
  }

  @Action(PetsActions.SetPendingPets)
  onSetPendingPets(
    { patchState }: StateContext<PetsStateModel>,
    { pets }: PetsActions.SetPendingPets,
  ) {
    patchState({ pendingPets: pets });
  }

  @Action(PetsActions.SetSoldPets)
  onSetSoldPets(
    { patchState }: StateContext<PetsStateModel>,
    { pets }: PetsActions.SetSoldPets,
  ) {
    patchState({ soldPets: pets });
  }

  @Action(PetsActions.SetAvailablePets)
  onSetAvailablePets(
    { patchState }: StateContext<PetsStateModel>,
    { pets }: PetsActions.SetAvailablePets,
  ) {
    patchState({ availablePets: pets });
  }

  @Action(PetsActions.UpdateFilterQ)
  onUpdateFilterQ(
    { patchState }: StateContext<PetsStateModel>,
    { filterQ }: PetsActions.UpdateFilterQ,
  ) {
    patchState({ filterQ });
  }
}
