<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Auth\Access\Response;

class UserPolicy
{
    use HandlesAuthorization;

    public function viewApp(User $user): bool
    {
        return true;
    }

    public function viewPrivateFields(?User $user, User $subject): Response
    {
        return $user?->is($subject)
            ? Response::allow()
            : Response::deny('You are not authorized to access this field.');
    }
}
