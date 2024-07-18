export type ScriptFactory = (
  scriptElement: HTMLScriptElement,
) => HTMLScriptElement;

export type PixelFactory = (pixel: HTMLElement) => HTMLElement;

export abstract class ScriptsLoader {
  abstract init(scripts: ScriptFactory[], pixels: PixelFactory[]): void;
}
