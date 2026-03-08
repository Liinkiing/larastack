# Larastack Backend 🚀

Welcome to the backend directory of your fullstack application template. This is where you'll build the server-side APIs used by both the Next.js frontend (`../frontend`) and the Expo/React Native mobile app (`../mobile`) using Laravel, Lighthouse GraphQL, and Laravel Socialite.

## Technologies Used 🛠️

### Laravel

- **Laravel**: A powerful PHP framework known for its elegant syntax and robust features. It's used to build the backend of your application, handle routes, database interactions, and more.

### Lighthouse GraphQL

- **Lighthouse GraphQL**: A GraphQL server package for Laravel that simplifies the implementation of GraphQL APIs. It's used to create and manage GraphQL endpoints for your application.

### Laravel Socialite

- **Laravel Socialite**: A Laravel package that facilitates easy integration with social authentication providers, making it simple to set up user authentication using popular social platforms.

## Get Started ⚙️

1. Clone the repository and install the shared JavaScript workspace dependencies from the repo root:

   ```shell
   git clone https://github.com/Liinkiing/larastack.git
   cd larastack
   pnpm install
   ```

2. Install PHP dependencies from `backend/`:

   ```shell
   cd backend
   docker run --rm \
       -u "$(id -u):$(id -g)" \
       -v "$(pwd):/app" \
       -w /app \
       composer:latest \
       composer install --ignore-platform-reqs
   ```

3. Copy the environment file:

   ```shell
   cp .env.example .env
   ```

4. Start the Sail services:

   ```shell
   ./vendor/bin/sail up -d
   ```

5. Generate a valid `APP_KEY`:

   ```shell
   ./vendor/bin/sail artisan key:generate
   ```

## Common Commands

Run these from the repo root unless noted otherwise:

```bash
pnpm --filter @larastack/backend dev
pnpm --filter @larastack/backend lint
pnpm --filter @larastack/backend test
pnpm --filter @larastack/backend typecheck
pnpm --filter @larastack/backend gql:dump
```

For direct Sail commands, run them from `backend/`.

## Learn More 📚

To learn more about the technologies used in this project, take a look at the following resources:

- [Laravel Documentation](https://laravel.com/docs)
- [Lighthouse GraphQL Documentation](https://lighthouse-php.com)
- [Laravel Socialite Documentation](https://laravel.com/docs/socialite)
