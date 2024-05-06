# AngularLove

## BFF

### Development

When developing locally via wrangler dev, add environment variables by
creating a `.dev.vars` file in the root directory of BFF app

```
touch ./apps/blog-bff/.dev.vars
```

Check `apps/blog-bff/.dev.vars.example` to follow the schema.

### Working with Angular Client

To change the BFF URL in Angular, create a new file named `.env.local` in the `apps/blog` directory.
Copy the contents of the main `.env` file into this new file and update the `AL_API_URL` key.
The newly created `.env.local` file will be recognized during the build process.

## Code Scaffolding

To generate new angular library, use the following command:

```
nx g @nx/angular:library your-custom-name --directory=shared
```

## Storybook

To run Storybook locally use the following command:

```
pnpm run start:storybook
```

To generate stories for specific library (aka project) use the following command:

```
pnpm nx g @nx/angular:stories --project=<project-name>
```
