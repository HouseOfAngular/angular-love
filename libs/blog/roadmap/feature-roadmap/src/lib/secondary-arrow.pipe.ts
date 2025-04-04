import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'secondaryArrow',
})
export class SecondaryArrowPipe implements PipeTransform {
  transform(horizontalShift: number, withArc = true): string {
    const radius = withArc ? 12 : 0; // Corner radius
    const height = 64;

    let path = `M 0 0 `;

    // Line down
    path += `L 0 ${height / 2} `;

    // Line right
    path += `L ${horizontalShift + (horizontalShift > 0 ? -radius : radius)} ${height / 2} `;

    if (withArc) {
      // Proper arc for the curved corner - this creates a 90° turn with exact radius
      if (horizontalShift > 0) {
        path += `A ${radius} ${radius} 0 0 1 ${horizontalShift} ${height / 2 + radius} `;
      } else {
        path += `A ${radius} ${radius} 0 0 0 ${horizontalShift} ${height / 2 + radius} `;
      }
    }

    // Line down after the curve
    path += `L ${horizontalShift} ${height}`; // Subtract 7 to account for arrowhead

    return path;
  }
}
