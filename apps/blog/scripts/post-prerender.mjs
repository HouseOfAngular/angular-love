import { readdir, rename } from 'node:fs/promises';
import { join } from 'node:path';

const DIST_DIR = 'dist/apps/blog';
const SKIP_FOLDERS = ['assets', 'images', 'styles', 'scripts'];

async function renamePrerenderedFiles(dirPath = DIST_DIR) {
  try {
    const entries = await readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const currentDirPath = join(dirPath, entry.name);

        if (SKIP_FOLDERS.includes(entry.name)) {
          continue;
        }

        const files = await readdir(currentDirPath);
        if (files.length === 0) {
          continue;
        }

        if (files.length > 1) {
          console.error(`Multiple files in ${currentDirPath}:`, files);
          await renamePrerenderedFiles(currentDirPath);
          continue;
        }

        const indexPath = join(currentDirPath, 'index.html');

        try {
          await rename(indexPath, join(currentDirPath, `${entry.name}.html`));
          console.log(`Renamed ${indexPath} to ${entry.name}.html`);
        } catch (error) {
          if (error.code !== 'ENOENT') {
            console.error(`Error processing ${currentDirPath}:`, error);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error during post-prerender processing:', error);
    process.exit(1);
  }
}

renamePrerenderedFiles();
