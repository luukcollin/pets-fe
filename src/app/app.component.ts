import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  debounceTime,
  distinctUntilChanged,
} from 'rxjs';
import { Pet } from 'src/models/pet.model';
import { Column } from 'src/models/table.model';
import { DataService } from './services/data-service';
import { PetsActions } from './store/pets.actions';
import { PetsState } from './store/pets.state';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'app';
  petForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    photoUrls: new FormControl('', [Validators.required]),
    id: new FormControl('', [Validators.required]),
  });

  visibleRows$: Observable<Pet[]> = new BehaviorSubject<Pet[]>([]);
  rows$ = new BehaviorSubject<Pet[]>([]);

  newId = '';
  newName = '';
  newImage = '';

  typedFilterQ$ = new BehaviorSubject('');
  petProperties: Column[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'status', label: 'Status' },
    { key: 'photoUrls', label: 'Images' },
  ];
  selectedPet: Pet | undefined = undefined;

  readonly allPets$ = this.store
    .select(PetsState.allPets)
    .pipe(distinctUntilChanged());
  readonly soldPets$ = this.store
    .select(PetsState.soldPets)
    .pipe(distinctUntilChanged());
  readonly availablePets$ = this.store
    .select(PetsState.availablePets)
    .pipe(distinctUntilChanged());
  readonly pendingPets$ = this.store
    .select(PetsState.pendingPets)
    .pipe(distinctUntilChanged());
  readonly filterq$ = this.store.select(PetsState.filterQ);
  private appSubscriptions: Subscription[] = [];
  private soldSub?: Subscription;
  private availableSub?: Subscription;
  private pendingSub?: Subscription;
  constructor(
    private dataService: DataService,
    private store: Store,
  ) {
    const filterQSub = this.filterq$.subscribe((value) =>
      this.onFilterChanged(value),
    );
    const availablePetsSubs = this.availablePets$.subscribe((values) => {
      this.rows$.next(values);
      this.visibleRows$ = this.rows$;
    });
    this.appSubscriptions.push(filterQSub);
    this.appSubscriptions.push(availablePetsSubs);
  }

  async onFilterChanged(statusFilter: string) {
    this.visibleRows$ =
      statusFilter === 'available'
        ? this.availablePets$
        : statusFilter === 'pending'
          ? this.pendingPets$
          : statusFilter === 'sold'
            ? this.soldPets$
            : this.allPets$;
  }

  async ngOnInit() {
    this.soldSub = this.dataService
      .getPets('sold')
      .pipe(distinctUntilChanged())
      .subscribe((pets) =>
        this.store.dispatch(new PetsActions.SetSoldPets(pets)),
      );
    this.pendingSub = this.dataService
      .getPets('pending')
      .pipe(distinctUntilChanged())
      .subscribe((pets) =>
        this.store.dispatch(new PetsActions.SetPendingPets(pets)),
      );
    this.availableSub = this.dataService
      .getPets('available')
      .pipe(distinctUntilChanged())
      .subscribe((pets) =>
        this.store.dispatch(new PetsActions.SetAvailablePets(pets)),
      );
    this.appSubscriptions.push(this.availableSub);
    this.appSubscriptions.push(this.pendingSub);
    this.appSubscriptions.push(this.availableSub);
  }

  ngOnDestroy() {
    this.appSubscriptions.forEach((sub) => sub.unsubscribe());
  }

  updateFilter(event: Event) {
    this.typedFilterQ$.next(
      (<HTMLInputElement>document.getElementById('status-input')).value,
    );
    this.typedFilterQ$
      .pipe(debounceTime(300))
      .subscribe((value) =>
        this.store.dispatch(new PetsActions.UpdateFilterQ(value)),
      );
  }

  async deletePetWithId(id: number) {
    let url =
      'http://localhost:8080/delete?' +
      new URLSearchParams({ id: id.toString() });
    return fetch(url, { method: 'DELETE' }).then(() => {
      // this.refreshEntries();
    });
  }

  onSubmit() {
    if (this.petForm.valid) {
      const petData = this.petForm.value;
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      this.dataService
        .addPet(
          {
            id: getIdOrFallbackId(petData.id),
            name: petData.name || '',
            category: {
              id: 1,
              name: 'Dogs',
            },
            photoUrls: [petData.photoUrls] || [''],
            tags: [
              {
                id: 0,
                name: 'string',
              },
            ],
            status: 'available',
          },
          headers,
        )
        .subscribe({
          next: (response) => {
            console.log(response);
          },
          error: (err) => {
            console.error(err);
          },
          complete: () => {
            console.log('Observable completed');
          },
        });
    }
  }

  removePetWithId($event: number) {
    this.deletePetWithId($event);
  }

  changPetSelection(event: Pet) {
    this.selectedPet = event;
  }

  newPetValuesArePresent() {
    return this.newId.length && this.newName.length && this.newImage.length;
  }
}

function getIdOrFallbackId(id?: string | null): number {
  return id?.length && !isNaN(Number(id))
    ? Number(id)
    : 1337 + new Date().getSeconds();
}
