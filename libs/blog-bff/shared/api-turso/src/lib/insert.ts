/*
  This script retrieves data from a WordPress API (for either a post or an author)
  based on the provided command-line arguments, maps the data into the required format,
  and then propagates the data to multiple Turso database groups whose names start with 'blog-'.

  Example Usage:
    bun run src/scripts/turso/insert.ts --resource=post --id=123
    bun run src/scripts/turso/insert.ts --resource=author --id=456

  Environment Variables:
    TURSO_ORG - Your Turso organization identifier.
    TURSO_API_TOKEN - Your Turso API token.
*/
import { parseArgs } from 'util';
import { createClient } from '@tursodatabase/api';
import { drizzle } from 'drizzle-orm/libsql';
import * as v from 'valibot';

import { NewArticle, NewAuthor } from '@angular-love/blog-bff/shared/schema';

import { toArticle } from './mappers/article';
import { toAuthor } from './mappers/author';
import {
  insertArticle,
  insertAuthor,
  removeArticle,
  removeAuthor,
} from './queries';
import { getWpResource } from './wp';

// Define allowed resource types and create a validation schema.
const ResourceList = ['post', 'author'] as const;
const ResourceSchema = v.picklist(ResourceList);
type Resource = v.InferInput<typeof ResourceSchema>;

// Define allowed resource types and create a validation schema.
const ActionList = ['create', 'update', 'delete'] as const;
const ActionSchema = v.picklist(ActionList);
type Action = v.InferInput<typeof ActionSchema>;

// Schema to validate and transform the id argument from string to number.
const IdSchema = v.pipe(v.string(), v.transform(parseInt));

// Parse command-line arguments using Bun.argv
const { values } = parseArgs({
  args: process.argv.slice(2),
  options: {
    resource: {
      type: 'string',
    },
    id: {
      type: 'string',
    },
    action: {
      type: 'string',
    },
  },
  strict: true,
  allowPositionals: true,
});

// Validate and transform the arguments
const id = v.parse(IdSchema, values.id);
const resource = v.parse(ResourceSchema, values.resource);
const action = v.parse(ActionSchema, values.action);

const [org, token] = requireEnv('TURSO_ORG', 'TURSO_API_TOKEN');
const [wpBaseUrl, wpApiToken] = requireEnv(
  'WP_REST_API_BASE_URL',
  'WP_REST_API_TOKEN',
);

// Create a Turso client instance for interacting with the API
const turso = createClient({
  org,
  token,
});

// Initialize WordPress resource client for fetching data
const wpResources = getWpResource({ apiToken: wpApiToken, baseUrl: wpBaseUrl });

// Log the starting process with provided parameters
console.log(`Starting process for resource: ${resource} with ID: ${id}`);

// Execute the main function and handle any errors
main(id, resource, action)
  .then(() => console.log('Completed process'))
  .catch((err) => {
    console.error('Error occurred in main process:', err);
    process.exit(1);
  });

type DeleteAuthorAction = { action: 'delete'; type: 'author'; id: number };
type DeleteArticleAction = { action: 'delete'; type: 'post'; id: number };

type CreateAuthorAction = { action: 'create'; type: 'author'; data: NewAuthor };
type CreateArticleAction = {
  action: 'create';
  type: 'post';
  data: NewArticle;
};

type UpdateAuthorAction = { action: 'update'; type: 'author'; data: NewAuthor };
type UpdateArticleAction = {
  action: 'update';
  type: 'post';
  data: NewArticle;
};

type Payload =
  | DeleteAuthorAction
  | DeleteArticleAction
  | CreateAuthorAction
  | CreateArticleAction
  | UpdateAuthorAction
  | UpdateArticleAction;

// Main function that coordinates fetching data and propagating it to databases.
async function main(id: number, resource: Resource, action: Action) {
  console.log(
    `Fetching WordPress data for resource: ${resource} with id: ${id}`,
  );
  const payload = await getWpData(id, resource, action);
  console.log(`Mapped Data: ${JSON.stringify(payload)}`);
  console.log('Propagating data to Turso databases...');
  await propagateData(payload);
}

// Fetches data from the WordPress API and maps it to the expected payload format.
async function getWpData(
  id: number,
  resource: Resource,
  action: Action,
): Promise<Payload> {
  if (action === 'delete') {
    return { type: resource, id, action };
  } else {
    switch (resource) {
      case 'author': {
        console.log(`Fetching author data for ID: ${id}`);
        const wpAuthor = await wpResources.author(id);
        return { type: resource, data: toAuthor(wpAuthor.data), action };
      }
      case 'post': {
        console.log(`Fetching post data for ID: ${id}`);
        const wpPost = await wpResources.post(id);
        return { type: resource, data: toArticle(wpPost.data), action };
      }
      default:
        // This should not occur because the input is validated beforehand.
        throw new Error('Unhandled resource type');
    }
  }
}

// Propagates the fetched data to each Turso database within blog groups.
async function propagateData(payload: Payload) {
  console.log('Listing all Turso groups...');
  const groups = await turso.groups.list();
  // Filter groups that are designated as blog groups (names starting with 'blog-').
  const blogGroups = groups.filter((group) => group.name.startsWith('blog-'));
  console.log(`Found ${blogGroups.length} blog group(s).`);

  for (const group of blogGroups) {
    console.log(`Processing group: ${group.name}`);

    // Construct the database name for the current group.
    const dbName = `${group.name}-main`;
    console.log(`Retrieving database: ${dbName}`);
    const tursoDb = await turso.databases.get(dbName);

    console.log('Generating temporary access tokens...');
    // Create a temporary token with full-access and 1-hour expiration.
    const tempGroupToken = await turso.databases.createToken(dbName, {
      authorization: 'full-access',
      expiration: '1h',
    });
    console.log(`Token generated: ${tempGroupToken.jwt}`);

    // Build the connection URL using the Turso database hostname.
    const url = `libsql://${tursoDb.hostname}`;
    console.log(`Initializing database connection using URL: ${url}`);
    const client = drizzle({
      connection: {
        url: url,
        authToken: tempGroupToken.jwt,
      },
    });

    // Insert data based on payload type (author or post).
    if (payload.type === 'author') {
      if (payload.action === 'delete') {
        console.log('Removing Author from database...');
        await removeAuthor(client, payload.id);
        console.log('Successfully removed Author.');
      } else {
        console.log('Inserting Author into database...');
        await insertAuthor(client, payload.data);
        console.log('Successfully inserted Author.');
      }
    }

    if (payload.type === 'post') {
      if (payload.action === 'delete') {
        console.log('Removing Post from database...');
        await removeArticle(client, payload.id);
        console.log('Successfully removed Post.');
      } else {
        console.log('Inserting Post into database...');
        await insertArticle(client, payload.data);
        console.log('Successfully inserted Post.');
      }
    }
  }
}

function requireEnv(...keys: string[]): string[] {
  const values = keys.map((key) => process.env[key]);
  const missing = keys.filter((_, i) => !values[i]);

  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }

  return values as string[];
}
