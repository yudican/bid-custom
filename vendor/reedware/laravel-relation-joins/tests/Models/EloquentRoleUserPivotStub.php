<?php

namespace Reedware\LaravelRelationJoins\Tests\Models;

class EloquentRoleUserPivotStub extends EloquentRelationJoinPivotStub
{
    protected $table = 'role_user';
    public $keyType = 'string';

    public function scopeWeb($query)
    {
        $query->where('domain', '=', 'web');
    }
}
