import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Workshop } from '../models/workshop.model';
import { Bezirksinfo } from '../models/bezirksinfo.model';

@Injectable({
  providedIn: 'root'
})
export class NodeAPIService {

  constructor(private http: HttpClient) { }

  getWorkshops() {
    const url = `${environment.nodeUrl}/workshops`;
    return this.http.get<Workshop[]>(url);
  }

  getStatistics(workshop: string) {
    const url = `${environment.nodeUrl}/stats?workshop=${workshop}`;
    const assertNumbersAreNumbers = map((items: Bezirksinfo[]) => {
      return items.map(item => {
        item.untergebracht = Number(item.untergebracht);
        item.geplant = Number(item.geplant);
        item.vorgeschlagen = Number(item.vorgeschlagen);
        item.heutevorgeschlagen = Number(item.heutevorgeschlagen);
        return item;
      });
    });
    return this.http.get<Bezirksinfo[]>(url).pipe(assertNumbersAreNumbers);
  }

}
