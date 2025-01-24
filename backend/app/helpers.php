<?php

if (! function_exists('frontend_url')) {
    /**
     * Generate a frontend url for the application.
     */
    function frontend_url(string $path = ''): string
    {
        return config('app.frontend_url').$path;
    }
}

if (! function_exists('object_getter_get')) {
    /**
     * Get an item from an object using "dot" notation.
     *
     * @param  object  $object
     * @param  string|null  $key
     * @param  mixed  $default
     * @return mixed
     */
    function object_getter_get($object, $key, $default = null)
    {
        if (is_null($key) || trim($key) === '') {
            return $object;
        }

        foreach (explode('.', $key) as $segment) {
            if (! is_object($object) || ! method_exists($object, $segment)) {
                return value($default);
            }

            $object = $object->{$segment}();
        }

        return $object;
    }
}
