<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Program extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'description', 'frequency', 'status', 'start_date', 'end_date',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date:Y-m-d',
            'end_date' => 'date:Y-m-d',
        ];
    }

    public function getStatusAttribute($value)
    {
        if ($value === 'cancelled') {
            return 'cancelled';
        }

        if (! $this->relationLoaded('activities') || $this->activities->isEmpty()) {
            if (! $this->start_date) {
                return $value;
            }

            $now = now()->setTimezone('Asia/Jakarta');
            $start = Carbon::parse($this->start_date->format('Y-m-d').' 00:00:00')->setTimezone('Asia/Jakarta');
            $end = $this->end_date ? Carbon::parse($this->end_date->format('Y-m-d').' 23:59:59')->setTimezone('Asia/Jakarta') : null;

            if ($now->isBefore($start)) {
                return 'planned';
            } elseif ($end && $now->isAfter($end)) {
                return 'completed';
            }

            return 'ongoing';
        }

        $hasOngoing = false;
        $hasPlanned = false;
        $now = now()->setTimezone('Asia/Jakarta');

        foreach ($this->activities as $activity) {
            $actStart = Carbon::parse($activity->activity_date->format('Y-m-d').' '.($activity->start_time ?? '00:00:00'))->setTimezone('Asia/Jakarta');
            $actEnd = Carbon::parse($activity->activity_date->format('Y-m-d').' '.($activity->end_time ?? '23:59:59'))->setTimezone('Asia/Jakarta');

            if ($now->isBefore($actStart)) {
                $hasPlanned = true;
            } elseif ($now->greaterThanOrEqualTo($actStart) && $now->lessThanOrEqualTo($actEnd)) {
                $hasOngoing = true;
            }
        }

        if ($hasOngoing) {
            return 'ongoing';
        }

        if ($hasPlanned) {
            return 'planned';
        }

        return 'completed';
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class);
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }

    public function activities(): HasMany
    {
        return $this->hasMany(ProgramActivity::class);
    }

    public function syncFromActivities(): void
    {
        $activities = $this->activities()->get();

        if ($activities->isEmpty()) {
            return;
        }

        $this->start_date = $activities->min('activity_date');
        $this->end_date = $activities->max('activity_date');

        $total = $activities->count();
        $completed = $activities->where('status', 'completed')->count();

        if ($completed === 0) {
            $this->status = 'planned';
        } elseif ($completed === $total) {
            $this->status = 'completed';
        } else {
            $this->status = 'ongoing';
        }

        $this->saveQuietly(); // saveQuietly to prevent infinite loops if we ever add events here
    }
}
