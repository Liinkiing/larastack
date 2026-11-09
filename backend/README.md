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

5. Generate a valid `APP_KEY` and migrate the database:

   ```shell
   ./vendor/bin/sail artisan key:generate
   ./vendor/bin/sail artisan migrate
   ```

## Common Commands

Run these from the repo root unless noted otherwise:

```bash
pnpm --filter @larastack/backend dev
pnpm --filter @larastack/backend lint
pnpm --filter @larastack/backend lint:fix
pnpm --filter @larastack/backend test
pnpm --filter @larastack/backend types:check
pnpm --filter @larastack/backend gql:dump
```

For direct Sail commands, run them from `backend/`.

## Queue workers and scheduler

Start Sail first to build the app image. For an existing checkout, set `QUEUE_CONNECTION=redis` in `backend/.env` to enable async jobs. Run these commands from the repository root:

```bash
pnpm --filter @larastack/backend workers:up
pnpm --filter @larastack/backend workers:logs
pnpm --filter @larastack/backend workers:reload
pnpm --filter @larastack/backend workers:down
```

The `workers` profile runs one worker for the default Redis queue, one for `realtime`, and Laravel's scheduler. `workers:reload` signals running queue workers to finish their current job before restarting and interrupts active sub-minute scheduler tasks. `workers:down` stops and removes those three containers. The Redis blocking interval defaults to five seconds and workers wake as soon as a job arrives. Keep `REDIS_QUEUE_RETRY_AFTER` above the worker timeout of 60 seconds.

`sail composer run dev` streams application logs via Pail. Run Vite from the host using the workspace `dev` script.

## Local S3 storage

Sail includes SeaweedFS, with the `larastack-local` bucket configured in `.env.example`. Laravel keeps its local filesystem default. Use `Storage::disk('s3')` to opt into object storage or set `FILESYSTEM_DISK=s3` to make it the default.

Inside Sail the S3 endpoint is `http://seaweedfs:8333`. From the host, use `http://localhost:8333` for S3 clients and `http://localhost:23646` for the SeaweedFS admin UI. If you generate presigned URLs for a browser or device, configure an endpoint reachable from both Laravel and the client, since the URL includes the signed host.

## Learn More 📚

To learn more about the technologies used in this project, take a look at the following resources:

- [Laravel Documentation](https://laravel.com/docs)
- [Lighthouse GraphQL Documentation](https://lighthouse-php.com)
- [Laravel Socialite Documentation](https://laravel.com/docs/socialite)
