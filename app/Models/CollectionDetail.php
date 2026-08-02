<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CollectionDetail extends Model
{
    protected $fillable = [
        'class_collection_id', 'student_id', 'kas_amount', 'jumat_berkah_amount', 'is_paid',
    ];

    protected $casts = [
        'is_paid' => 'boolean',
    ];

    public function collection()
    {
        return $this->belongsTo(ClassCollection::class, 'class_collection_id');
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
