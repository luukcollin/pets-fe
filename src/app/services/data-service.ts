import { Injectable } from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { Observable } from "rxjs";
import { Pet, Status } from "src/models/api";
import { FormGroup } from "@angular/forms";

const POST_ENDPOINT = "https://petstore3.swagger.io/api/v3/pet";
const GET_ENDPOINT = "https://petstore3.swagger.io/api/v3/pet/findByStatus?status=";

@Injectable({
    providedIn: 'root'
  })
  export class DataService {  
      constructor(private http: HttpClient) {}
  
      getPets(status: Status): Observable<Pet[]> {
          return this.http.get<Pet[]>(`${GET_ENDPOINT}${status}`);
      }

    //   addPet(pet: any): Observable<Pet>  {
    //     return this.http.post<any>(`${POST_ENDPOINT}`, pet);
    //   }

      addPet(pet: any, headers: HttpHeaders): Observable<Pet>  {
        return this.http.post<any>(`${POST_ENDPOINT}`, pet, {headers});
      }
  }