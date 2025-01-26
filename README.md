# Larastack 🚀

Welcome to Larastack, a fullstack starter template that combines the power of Laravel for the backend and Next.js for the frontend. This starter kit is designed to streamline the development process, making it easier to build modern, scalable web applications.

## Technologies Used 🛠️

### Backend

- **Laravel**: A robust PHP framework used to build the backend of the application, handle routes, database interactions, and more.
- **Lighthouse GraphQL**: A GraphQL server package for Laravel that simplifies the implementation of GraphQL APIs.
- **Laravel Socialite**: Facilitates easy integration with social authentication providers, making it simple to set up user authentication using popular social platforms.

### Frontend

- **Next.js**: A powerful React framework for building server-side rendered and statically generated web applications.
- **Panda CSS**: A styling engine used for writing CSS-in-JS, providing flexibility and ease of use in styling components.
- **Storybook**: A tool for developing UI components in isolation, making it easier to build and test components.

## Features ✨

- **GraphQL Integration**: Easily create and manage GraphQL endpoints with Lighthouse.
- **OAuth Login**: Simplified user authentication using Laravel Socialite.
- **Custom Components**: A set of custom components to ease development when building new features.

## Installation ⚙️

### Backend

1. Clone the repository:

   ```shell
   git clone https://github.com/Liinkiing/larastack.git
   cd larastack/backend
   ```

2. Install dependencies using Docker:

   ```shell
   docker run --rm \
       -u "$(id -u):$(id -g)" \
       -v "$(pwd):/var/www/html" \
       -w /var/www/html \
       laravelsail/php84-composer:latest \
       composer install --ignore-platform-reqs
   ```

3. Add an alias for the `sail` command to your shell configuration file (e.g. `~/.bashrc` or `~/.zshrc`):

   ```shell
   alias sail='[ -f sail ] && sh sail || sh vendor/bin/sail'
   ```

4. Copy the example environment file and update your variables:

   ```shell
   cp .env.example .env
   ```

5. Start the containers:

   ```shell
   sail up -d
   ```

6. Generate a valid `APP_KEY`:
   ```shell
   sail artisan key:generate
   ```

### Frontend

1. Navigate to the frontend directory:

   ```shell
   cd ../frontend
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Run the development server:

   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More 📚

To learn more about the technologies used in this project, take a look at the following resources:

- [Laravel Documentation](https://laravel.com/docs)
- [Lighthouse GraphQL Documentation](https://lighthouse-php.com)
- [Laravel Socialite Documentation](https://laravel.com/docs/socialite)
- [Next.js Documentation](https://nextjs.org/docs)
- [Panda CSS Documentation](https://panda-css.com)
- [Storybook Documentation](https://storybook.js.org/docs)

## Deploy on Vercel 🚀

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
