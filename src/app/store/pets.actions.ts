import { Pet } from "src/models/api";


export namespace PetsActions {
    export class SetSoldPets{
        static readonly type = "[PETS] SetSoldPets";

        constructor(public pets: Pet[]){}
    }
    export class SetAvailablePets{
        static readonly type = "[PETS] SetAvailablePets";

        constructor(public pets: Pet[]){}
    }
    export class SetPendingPets{
        static readonly type = "[PETS] SetPendingPets";

        constructor(public pets: Pet[]){}
    }

    export class UpdateFilterQ {
        static readonly type = "[PETS] UpdateFilterQ";

        constructor(public filterQ: string){}
    }
}