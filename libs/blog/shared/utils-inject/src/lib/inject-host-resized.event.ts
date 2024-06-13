import { isPlatformServer } from '@angular/common';
import { DestroyRef, ElementRef, inject, PLATFORM_ID } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';

export const injectHostResizedEvent = (): Observable<ResizeObserverEntry[]> => {
  if (isPlatformServer(inject(PLATFORM_ID))) {
    return of();
  }

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
