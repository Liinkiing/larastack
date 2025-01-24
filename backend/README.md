# Backend

Welcome to the backend directory of your fullstack application template! This is where you'll be working on the server-side of your application using Laravel, Lighthouse GraphQL, and Laravel Socialite for user authentication.

## Technologies Used

### Laravel
- Laravel is a powerful PHP framework known for its elegant syntax and robust features. It's used to build the backend of your application, handle routes, database interactions, and more.

### Lighthouse GraphQL
- Lighthouse is a GraphQL server package for Laravel that simplifies the implementation of GraphQL APIs. It's used to create and manage GraphQL endpoints for your application.

### Laravel Socialite
- Laravel Socialite is a Laravel package that facilitates easy integration with social authentication providers, making it simple to set up user authentication using popular social platforms.

## Installation

```shell
docker run --rm \
    -u "$(id -u):$(id -g)" \
    -v "$(pwd):/var/www/html" \
    -w /var/www/html \
    laravelsail/php83-composer:latest \
    composer install --ignore-platform-reqs
```

Then if you want to use the `sail` command, you need to add an
alias to your shell configuration file (e.g. `~/.bashrc` or
`~/.zshrc`):

```shell
alias sail='[ -f sail ] && sh sail || sh vendor/bin/sail'
```

Then, you can `cp .env.example .env` and update your variables.

After that, you can start the containers with:

```shell
sail up -d
```

Don't forget to run the Artisan command to generate a valid `APP_KEY`

```shell
sail artisan key:generate
```
