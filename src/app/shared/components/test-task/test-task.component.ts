import { Component, OnInit } from '@angular/core';

import { EMPTY, Observable, ReplaySubject, map, of } from 'rxjs';
import { throttleTime, scan, switchMap, catchError } from 'rxjs/operators';
import { FormControl, Validators } from '@angular/forms';
import { EventSourceService } from '../../services/event-source.service';

@Component({
  selector: 'app-test-task',
  templateUrl: './test-task.component.html',
  styleUrls: ['./test-task.component.scss'],
  providers: [EventSourceService],
})
export class TestTaskComponent implements OnInit {
  pictureStream$: Observable<string>;
  fc = new FormControl(null, [Validators.min(1), Validators.max(3)]);

  originalResolution$ = new ReplaySubject<{
    naturalWidth: number;
    naturalHeight: number;
  }>(1);

  constructor(private eventSourceService: EventSourceService) {}

  ngOnInit(): void {
    this._initialize();
  }

  onPictureLoad(img: Event) {
    let imgElement = img.target as HTMLImageElement;
    this.originalResolution$.next({
      naturalHeight: imgElement.naturalHeight,
      naturalWidth: imgElement.naturalWidth,
    });
  }

  private _initialize() {
    this.pictureStream$ = this.fc.valueChanges.pipe(
      switchMap((pictureId) => {
        return this.eventSourceService.getPicture(pictureId).pipe(
          map((data) => data.frameData),
          scan((acc, val) => {
            return btoa(atob(acc) + atob(val));
          }),
          throttleTime(200),
          map((data) => {
            return 'data:image/png;base64,' + data;
          }),
          catchError((err) => {
            return EMPTY;
          })
        );
      })
    );
  }
}
