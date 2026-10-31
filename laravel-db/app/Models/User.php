<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'work_unit_id',
        'name',
        'nip',
        'email',
        'password',
        'role',
        'status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function workUnit()
    {
        return $this->belongsTo(WorkUnit::class, 'work_unit_id');
    }

    public function evaluations()
    {
        return $this->hasMany(Evaluation::class, 'evaluator_user_id');
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isKoordinator(): bool
    {
        return in_array($this->role, ['admin', 'koordinator']);
    }
}
