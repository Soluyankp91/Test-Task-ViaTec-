import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

// Я не можу доступитися до Http code 404, тому я не обровлював звичайні помилки. Оскільки я не можу таким чином відрізнити
// закриття потоку від 404 помилки
export interface PacketFormat {
  pictureSize: number;

  frameOffset: number;

  frameData: string;
}
@Injectable()
export class EventSourceService {
  es: EventSource;
  constructor() {}

  getPicture(testNumber: number | null): Observable<PacketFormat> {
    const url =
      ' https://devfirmware.maks.systems:8443/api/v1/pictures/download/stream/sse/test';
    let queryParams = new HttpParams();
    if (testNumber) {
      queryParams = queryParams.append('testNumber', testNumber);
    }

    const urlWithQueryParams = `${url}?${queryParams.toString()}`;
    return new Observable<string>((obs) => {
      // на випадок якщо es вже відкритий
      if (this.es) {
        this.es.close();
      }
      const es = (this.es = new EventSource(urlWithQueryParams));
      es.addEventListener('message', (evt) => {
        obs.next(evt.data);
      });

      es.addEventListener('error', (err) => {
        obs.error(err);
        obs.complete();
        es.close();
      });
    }).pipe(map((data) => JSON.parse(data)));
  }
}
