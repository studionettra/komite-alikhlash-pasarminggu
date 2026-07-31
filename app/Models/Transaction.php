<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'type', 'amount', 'description', 'date', 'program_id', 'program_activity_id', 'receipt_path',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
        ];
    }

    public function program(): BelongsTo
    {
        return $this->belongsTo(Program::class);
    }

    public function programActivity(): BelongsTo
    {
        return $this->belongsTo(ProgramActivity::class);
    }
}
