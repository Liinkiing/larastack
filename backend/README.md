# Larastack Backend 🚀

Welcome to the backend directory of your fullstack application template. This is where you'll build the server-side APIs used by both the Next.js frontend (`../frontend`) and the Expo/React Native mobile app (`../mobile`) using Laravel, Lighthouse GraphQL, and Laravel Socialite.

## Technologies Used 🛠️

### Laravel
- **Laravel**: A powerful PHP framework known for its elegant syntax and robust features. It's used to build the backend of your application, handle routes, database interactions, and more.

### Lighthouse GraphQL
- **Lighthouse GraphQL**: A GraphQL server package for Laravel that simplifies the implementation of GraphQL APIs. It's used to create and manage GraphQL endpoints for your application.

### Laravel Socialite
- **Laravel Socialite**: A Laravel package that facilitates easy integration with social authentication providers, making it simple to set up user authentication using popular social platforms.

## Installation ⚙️

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
        laravelsail/php85-composer:latest \
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

## Learn More 📚

To learn more about the technologies used in this project, take a look at the following resources:
- [Laravel Documentation](https://laravel.com/docs)
- [Lighthouse GraphQL Documentation](https://lighthouse-php.com)
- [Laravel Socialite Documentation](https://laravel.com/docs/socialite)
