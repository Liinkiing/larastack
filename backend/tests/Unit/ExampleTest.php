<?php

it('runs on the supported PHP version', function () {
    expect(PHP_VERSION_ID)->toBeGreaterThanOrEqual(80500);
});
