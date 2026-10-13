/** Position of the last item of a page: its publish date (whole seconds, as stored) and id. */
export interface AiNewsCursor {
  publishedAt: Date;
  id: number;
}

// The cursor is opaque to clients: base64url of `<unix seconds>.<id>`.
export function encodeCursor({ publishedAt, id }: AiNewsCursor): string {
  const seconds = Math.floor(publishedAt.getTime() / 1000);
  return btoa(`${seconds}.${id}`)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/** Returns `null` for anything that isn't a cursor this API issued. */
export function decodeCursor(cursor: string): AiNewsCursor | null {
  let decoded: string;
  try {
    decoded = atob(cursor.replace(/-/g, '+').replace(/_/g, '/'));
  } catch {
    return null;
  }

  const match = /^(-?\d+)\.(\d+)$/.exec(decoded);
  if (!match) {
    return null;
  }
  const seconds = Number(match[1]);
  const id = Number(match[2]);
  if (!Number.isSafeInteger(seconds) || !Number.isSafeInteger(id)) {
    return null;
  }

  return { publishedAt: new Date(seconds * 1000), id };
}
