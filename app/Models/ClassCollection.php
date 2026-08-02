<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClassCollection extends Model
{
    protected $fillable = [
        'classroom_id', 'month', 'year', 'total_kas', 'total_jumat_berkah',
        'transfer_proof', 'status', 'verified_by', 'verified_at',
    ];

    protected $casts = [
        'verified_at' => 'datetime',
    ];

    public function classroom()
    {
        return $this->belongsTo(Classroom::class);
    }

    public function details()
    {
        return $this->hasMany(CollectionDetail::class);
    }

    public function verifier()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }
}
