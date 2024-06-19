import { DestroyRef, ElementRef, inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export const injectHostResizedEvent = (): Observable<ResizeObserverEntry[]> => {
  const elementRef = inject(ElementRef);
  const destroyRef = inject(DestroyRef);

  const changeSubject$ = new Subject<ResizeObserverEntry[]>();

  const observer = new ResizeObserver((event) => {
    changeSubject$.next(event);
  });

  observer.observe(elementRef.nativeElement);

  destroyRef.onDestroy(() => observer.unobserve(elementRef.nativeElement));

  return changeSubject$.asObservable();
};
