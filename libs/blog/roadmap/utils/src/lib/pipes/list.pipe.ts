import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'alListPipe',
  pure: true,
  standalone: true,
})
export class ListPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    const firstColonIndex = value.indexOf(':');
    if (firstColonIndex === -1) return value; // no colon, return as-is

    const intro = value.slice(0, firstColonIndex + 1).trim();
    const rest = value.slice(firstColonIndex + 1).trim();

    const parts = rest
      .split(';')
      .map((p) => p.trim())
      .filter(Boolean);

    const listItems = parts.map((part) => {
      const i = part.indexOf('–');
      if (i !== -1) {
        const label = part.slice(0, i + 1);
        const content = part.slice(i + 1).trim();
        return `<li><span class="font-semibold">${label}</span> ${content}</li>`;
      }
      return `<li>${part}</li>`;
    });

    return `
      <p class="text-justify leading-7 text-white/90 mb-4">${intro}</p>
      <ul class="list-disc pl-6 space-y-1 text-justify leading-7 text-white/90">
        ${listItems.join('')}
      </ul>
    `;
  }
}
