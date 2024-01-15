import { NgModule } from "@angular/core";
import { NgxsModule } from "@ngxs/store";
import { PetsState } from "./pets.state";

@NgModule({
    imports: [NgxsModule.forFeature([PetsState])]
})
export class PetsStoreModule{}
