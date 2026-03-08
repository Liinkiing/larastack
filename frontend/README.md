# Larastack Frontend 🚀

This is the web frontend part of the Larastack project, a fullstack starter template with a Laravel backend, a Next.js web app, and an Expo/React Native mobile app in `../mobile`.

## Technologies Used 🛠️

- **Next.js**: A powerful React framework for building server-side rendered and statically generated web applications.
- **Panda CSS**: A styling engine used for writing CSS-in-JS, providing flexibility and ease of use in styling components.
- **Storybook**: A tool for developing UI components in isolation, making it easier to build and test components.

## Features ✨

- **GraphQL Integration**: Easily create and manage GraphQL endpoints.
- **OAuth Login**: Simplified user authentication.
- **Custom Components**: A set of custom components to ease development when building new features.

## Getting Started 🏁

From the repository root, install dependencies and start the frontend dev server:

```bash
pnpm install
pnpm --filter @larastack/frontend dev
```

Or from this directory (`frontend/`):

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the public landing page in `app/(public)/page.tsx`. The page auto-updates as you edit the file.

## Common Commands

Run these from the repo root:

```bash
pnpm --filter @larastack/frontend dev
pnpm --filter @larastack/frontend build
pnpm --filter @larastack/frontend ts:check
pnpm --filter @larastack/frontend gen:gql
pnpm --filter @larastack/frontend storybook
```

## Project Structure 📁

Here's a brief overview of the project structure:

- `app/`: Contains the application's pages and logic.
- `src/shared/`: Contains reusable logic and shared components.
- `src/theme/` and `src/ui/`: Contain the Panda theme setup and shared UI primitives.
- `src/apollo/`: Contains Apollo Client setup and GraphQL helpers.

## Learn More 📚

To learn more about the technologies used in this project, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Panda CSS Documentation](https://panda-css.com)
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Storybook Documentation](https://storybook.js.org/docs/get-started/install)

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel 🚀

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
