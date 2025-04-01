import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'al-svg-path',
  template: `
    <svg
      [attr.width]="width"
      [attr.height]="height"
      [attr.viewBox]="'0 0 ' + width + ' ' + height"
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="6"
          markerHeight="8"
          refX="0"
          refY="4"
          orient="auto"
        >
          <polygon points="0 0, 6 4, 0 8" fill="#FDF5FD" />
        </marker>
      </defs>
      @for (path of pathData; track $index) {
        <path
          [attr.d]="path"
          fill="none"
          stroke="#FDF5FD"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          marker-end="url(#arrowhead)"
        />
      }
    </svg>
  `,
  styles: [],
})
export class SvgPathComponent implements OnInit {
  @Input() startX = 20;
  @Input() startY = 20;

  pathData = [] as string[];
  width = 300;
  height = 150;

  ngOnInit(): void {
    this.generatePath();
    this.generatePath(120);
    this.generatePath(300);
  }

  generatePath(horizontalLength = 200): void {
    const radius = 16; // Corner radius

    // Starting point
    const x1 = this.startX;
    const y1 = this.startY;

    // First go down for 24px
    const x2 = x1;
    const y2 = y1 + 24;

    // Then turn right and go horizontally
    const x3 = x2 + horizontalLength;
    const y3 = y2;

    // Calculate the path
    // Move to starting point
    let path = `M ${x1} ${y1} `;

    // Line down
    path += `L ${x2} ${y2} `;

    // Line right
    path += `L ${x3 - radius} ${y3} `;

    // Proper arc for the curved corner - this creates a 90° turn with exact radius
    path += `A ${radius} ${radius} 0 0 1 ${x3} ${y3 + radius} `;

    // Line down after the curve
    path += `L ${x3} ${y3 + radius + 24 - 7}`; // Subtract 7 to account for arrowhead

    this.pathData.push(path);

    // Set SVG dimensions to fit the path
    this.width = Math.max(x1, x2, x3) + 20;
    this.height = Math.max(y1, y2, y3 + radius + 24) + 20;
  }
}
