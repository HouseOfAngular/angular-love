import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rightSlice',
})
export class RightSlicePipe implements PipeTransform {
  transform<T>(value: T[]): T[] {
    const halfLength = Math.ceil(value.length / 2);
    return value.slice(halfLength);
  }
}
