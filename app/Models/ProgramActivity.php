<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProgramActivity extends Model
{
    protected $fillable = [
        'program_id',
        'title',
        'activity_date',
        'start_time',
        'end_time',
        'description',
        'status',
    ];

    public function getStatusAttribute($value)
    {
        if ($value === 'cancelled') {
            return 'cancelled';
        }

        if (!$this->activity_date) {
            return $value;
        }

        $now = now()->setTimezone('Asia/Jakarta');
        $start = \Carbon\Carbon::parse($this->activity_date->format('Y-m-d') . ' ' . ($this->start_time ?? '00:00:00'))->setTimezone('Asia/Jakarta');
        $end = \Carbon\Carbon::parse($this->activity_date->format('Y-m-d') . ' ' . ($this->end_time ?? '23:59:59'))->setTimezone('Asia/Jakarta');

        if ($now->isBefore($start)) {
            return 'planned';
        } elseif ($now->isAfter($end)) {
            return 'completed';
        }

        return 'ongoing';
    }

    protected function casts(): array
    {
        return [
            'activity_date' => 'date:Y-m-d',
        ];
    }

    public function program(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Program::class);
    }

    public function documents(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Document::class);
    }

    public function transactions(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    protected static function booted(): void
    {
        static::saved(function (ProgramActivity $activity) {
            $activity->program->syncFromActivities();
        });

        static::deleted(function (ProgramActivity $activity) {
            $activity->program->syncFromActivities();
        });
    }
}
