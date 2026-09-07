<?php

return [
    'apple' => [
        'token_invalid' => 'Invalid Apple identity token.',
        'issuer_invalid' => 'Invalid Apple token issuer.',
        'audience_invalid' => 'Apple token audience is not allowed.',
        'subject_missing' => 'Apple token subject is missing.',
        'temporarily_unavailable' => 'Unable to verify Apple identity token right now. Try again.',
        'key_response_invalid' => 'Invalid Apple key response.',
        'key_set_invalid' => 'Invalid Apple key set.',
    ],
    'google' => [
        'token_invalid' => 'Invalid Google ID token.',
        'issuer_invalid' => 'Invalid Google token issuer.',
        'audience_invalid' => 'Google token audience is not allowed.',
        'subject_missing' => 'Google token subject is missing.',
        'temporarily_unavailable' => 'Unable to verify Google ID token right now. Try again.',
        'key_response_invalid' => 'Invalid Google key response.',
        'key_set_invalid' => 'Invalid Google key set.',
    ],
];
