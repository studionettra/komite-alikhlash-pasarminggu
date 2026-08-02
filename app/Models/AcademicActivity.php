<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AcademicActivity extends Model
{
    protected $fillable = [
        'academic_month_id',
        'date_string',
        'name',
        'description',
        'is_committee_program',
    ];

    protected $casts = [
        'is_committee_program' => 'boolean',
    ];

    public function month(): BelongsTo
    {
        return $this->belongsTo(AcademicMonth::class, 'academic_month_id');
    }
}
