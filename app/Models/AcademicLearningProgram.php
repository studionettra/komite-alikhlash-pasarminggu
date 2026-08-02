<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AcademicLearningProgram extends Model
{
    protected $fillable = [
        'academic_month_id',
        'week_string',
        'topic',
        'date_string',
        'sub_topic',
        'description',
    ];

    public function month(): BelongsTo
    {
        return $this->belongsTo(AcademicMonth::class, 'academic_month_id');
    }
}
