# Larastack 🚀

Welcome to Larastack, a fullstack starter template that combines Laravel for the backend, Next.js for the web frontend, and Expo/React Native for mobile. This starter kit is designed to streamline development for modern, scalable, multi-platform applications.

## Technologies Used 🛠️

### Backend

- **Laravel**: A robust PHP framework used to build the backend of the application, handle routes, database interactions, and more.
- **Lighthouse GraphQL**: A GraphQL server package for Laravel that simplifies the implementation of GraphQL APIs.
- **Laravel Socialite**: Facilitates easy integration with social authentication providers, making it simple to set up user authentication using popular social platforms.

### Frontend

- **Next.js**: A powerful React framework for building server-side rendered and statically generated web applications.
- **Panda CSS**: A styling engine used for writing CSS-in-JS, providing flexibility and ease of use in styling components.
- **Storybook**: A tool for developing UI components in isolation, making it easier to build and test components.

### Mobile

- **Expo**: A platform and toolchain for building and shipping React Native apps quickly.
- **React Native**: A framework for building native mobile apps using React.
- **Expo Router**: File-based routing and navigation for Expo apps.

## Features ✨

- **GraphQL Integration**: Easily create and manage GraphQL endpoints with Lighthouse.
- **OAuth Login**: Simplified user authentication using Laravel Socialite.
- **Custom Components**: A set of custom components to ease development when building new features.
- **Cross-Platform Setup**: Build backend, web, and mobile apps from a single monorepo.

## Installation ⚙️

1. Clone the repository and install shared JavaScript dependencies:

   ```shell
   git clone https://github.com/Liinkiing/larastack.git
   cd larastack
   pnpm install
   ```

### Backend

From `backend/`, install PHP dependencies and boot Laravel Sail:

```shell
cd backend
docker run --rm \
    -u "$(id -u):$(id -g)" \
    -v "$(pwd):/app" \
    -w /app \
    composer:latest \
    composer install --ignore-platform-reqs
cp .env.example .env
./vendor/bin/sail up -d
./vendor/bin/sail artisan key:generate
```

### Frontend

From the repo root, start the web app with:

```bash
pnpm --filter @larastack/frontend dev
```

Then open [http://localhost:3000](http://localhost:3000).

### Mobile

From the repo root, start the Expo app with:

```bash
pnpm --filter @larastack/mobile dev
```

Use the terminal prompts to open the app in an iOS simulator, Android emulator, web, or Expo Go. For native auth and other native-module flows, prefer a development build over Expo Go.

## Learn More 📚

To learn more about the technologies used in this project, take a look at the following resources:

- [Laravel Documentation](https://laravel.com/docs)
- [Lighthouse GraphQL Documentation](https://lighthouse-php.com)
- [Laravel Socialite Documentation](https://laravel.com/docs/socialite)
- [Next.js Documentation](https://nextjs.org/docs)
- [Panda CSS Documentation](https://panda-css.com)
- [Storybook Documentation](https://storybook.js.org/docs)
- [Expo Documentation](https://docs.expo.dev)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)

## Deploy on Vercel 🚀

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
