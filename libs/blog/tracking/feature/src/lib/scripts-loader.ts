export type ScriptFactory = (
  scriptElement: HTMLScriptElement,
) => HTMLScriptElement;

export abstract class ScriptsLoader {
  abstract init(scripts: ScriptFactory[]): void;
}
