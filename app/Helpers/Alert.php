<?php

namespace App\Helpers;

class Alert
{
    public static function success(string $title, string $message = ''): void
    {
        self::flash('success', $title, $message);
    }

    public static function error(string $title, string $message = ''): void
    {
        self::flash('error', $title, $message);
    }

    public static function info(string $title, string $message = ''): void
    {
        self::flash('info', $title, $message);
    }

    public static function warning(string $title, string $message = ''): void
    {
        self::flash('warning', $title, $message);
    }

    public static function deleteSuccess(string $title, string $message = ''): void
    {
        self::flash('delete-success', $title, $message);
    }

    protected static function flash(string $type, string $title, string $message): void
    {
        session()->flash('alert', [
            'type' => $type,
            'title' => $title,
            'message' => $message,
        ]);
    }
}
