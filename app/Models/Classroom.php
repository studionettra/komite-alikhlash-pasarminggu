<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Classroom extends Model
{
    protected $fillable = ['name', 'korlas_id'];

    public function korlas()
    {
        return $this->belongsTo(User::class, 'korlas_id');
    }

    public function students()
    {
        return $this->hasMany(Student::class);
    }
}
