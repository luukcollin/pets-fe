import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { BehaviorSubject, Observable, debounceTime, distinctUntilChanged } from "rxjs";
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
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  title = 'app';
  petForm = new FormGroup({
        name: new FormControl('', [Validators.required]),
        photoUrls: new FormControl([],[Validators.required]),
        id: new FormControl('', [Validators.required])
    });

  visibleRows$: Observable<Pet[]> = new BehaviorSubject<Pet[]>([]);

  newId = ""; 
  newName = "";
  newImage = "";

  
  typedFilterQ$ = new BehaviorSubject("");
  petProperties: Column[] = [{ key: 'id', label: "ID" }, { key: 'name', label: "Name" }, { key: 'status', label: "Status" }, { key: 'photoUrls', label: 'Images' }]
  selectedPet: Pet | undefined = undefined;

  readonly allPets$ =  this.store.select(PetsState.allPets).pipe(distinctUntilChanged());
  readonly soldPets$ = this.store.select(PetsState.soldPets).pipe(distinctUntilChanged());
  readonly availablePets$ = this.store.select(PetsState.availablePets).pipe(distinctUntilChanged());
  readonly pendingPets$ = this.store.select(PetsState.pendingPets).pipe(distinctUntilChanged());
  readonly filterq$ = this.store.select(PetsState.filterQ);  
  
  constructor(private dataService: DataService, private store: Store){
    this.filterq$.subscribe((value) => this.onFilterChanged(value))
    this.availablePets$.subscribe(() => this.visibleRows$ = this.availablePets$)
  }

  async onFilterChanged(statusFilter: string){
    this.visibleRows$ = statusFilter ===  "available" ? this.availablePets$ : statusFilter ===  "pending" ?  this.pendingPets$ 
    : statusFilter ===  "sold" ?  this.soldPets$ :  this.allPets$;
  }

  async ngOnInit() {
    this.dataService.getPets("sold").pipe(distinctUntilChanged()).subscribe(pets => this.store.dispatch(new PetsActions.SetSoldPets(pets)));
    this.dataService.getPets("pending").pipe(distinctUntilChanged()).subscribe(pets => this.store.dispatch(new PetsActions.SetPendingPets(pets)));
    this.dataService.getPets("available").pipe(distinctUntilChanged()).subscribe(pets => this.store.dispatch(new PetsActions.SetAvailablePets(pets)));
  }

  
  updateFilter(event: Event) {
    this.typedFilterQ$.next((<HTMLInputElement> document.getElementById('status-input')).value);
    this.typedFilterQ$.pipe(debounceTime(300)).subscribe(value => this.store.dispatch(new PetsActions.UpdateFilterQ(value)));
  }

  async deletePetWithId(id: number) {
    let url = 'http://localhost:8080/delete?' + new URLSearchParams({ id: id.toString() });
    return fetch(url, { method: 'DELETE' }).then(() => {
      // this.refreshEntries();
    });
  };

  onSubmit(){
    
    if (this.petForm.valid) {
      const petData = this.petForm.value;
      const category ={ "id": 1, "name": "Dogs"}
      const tags = { "id": 0, "name": "string"}
      const headers = new HttpHeaders({'Content-Type': 'application/json'})
      const requestObj = JSON.stringify({id: getIdOrFallbackId(petData.id), name: petData.name || "", photoUrls: petData.photoUrls || [""], category, tags})
      this.dataService.addPet({ "id": 857412, "name": "xmy",
        "category": {
          "id": 1,
          "name": "Dogs"
        },
        "photoUrls": [
          "string"
        ],
        "tags": [
          {
            "id": 0,
            "name": "string"
          }
        ],
        "status": "available"
      }, headers).subscribe( (response) => {
        console.log(response)
      })
  }
}
  

  removePetWithId($event: number) {
    this.deletePetWithId($event)
  }

  changPetSelection(event: Pet) {
    this.selectedPet = event;
  }

  newPetValuesArePresent() {
    return this.newId.length && this.newName.length && this.newImage.length; 
  }
}

function getIdOrFallbackId(id?: string | null): number{
  return id?.length && !isNaN(Number(id)) ? Number(id)  : 1337 + new Date().getSeconds();;
}