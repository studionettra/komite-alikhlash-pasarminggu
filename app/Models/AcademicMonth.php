<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AcademicMonth extends Model
{
    protected $fillable = [
        'academic_year_id',
        'name',
        'year',
        'effective_days',
        'order_index',
    ];

    public function academicYear(): BelongsTo
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function activities(): HasMany
    {
        return $this->hasMany(AcademicActivity::class);
    }

    public function learningPrograms(): HasMany
    {
        return $this->hasMany(AcademicLearningProgram::class);
    }
}
