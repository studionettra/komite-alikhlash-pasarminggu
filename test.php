<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$program = App\Models\Program::find(3);
$program->load([
    'documents' => fn($q) => $q->whereNull('program_activity_id'),
    'transactions' => fn($q) => $q->whereNull('program_activity_id'),
    'users', 
    'activities' => fn($q) => $q->orderBy('activity_date', 'desc'),
    'activities.documents', 
    'activities.transactions'
]);
echo json_encode($program->toArray());
