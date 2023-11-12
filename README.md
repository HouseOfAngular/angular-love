# AngularLove

## BFF

### Development

When developing locally via wrangler dev, add environment variables by
creating a `.dev.vars` file in the root directory of BFF app

```
touch ./apps/blog-bff/.dev.vars
```

Check `apps/blog-bff/.dev.vars.example` to follow the schema.

## Storybook

To run Storybook locally use the following command:

```
pnpm run start:storybook
```

To generate stories for specific library (aka project) use the following command:

```
pnpm nx g @nx/angular:stories --project=<project-name>
```
