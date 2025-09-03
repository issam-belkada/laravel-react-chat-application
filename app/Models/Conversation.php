<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    protected $fillable = [
        'user_id1',
        'user_id2',
        'last_message_id',
    ];

    public function lastMessage()
    {
        return $this->belongsTo(Message::class, 'last_message_id');
    }
    
    public function user1()
    {
        return $this->belongsTo(User::class, 'user_id1');
    }

    public function user2()
    {
        return $this->belongsTo(User::class, 'user_id2');
    }
    public static function getConversationsForSidebar($user)
    {
        $users = User::getUserExceptUser($user);
        $groups = Group::getGroupsForUser($user);

        return $users->map(function (User $user)
        {
            return $user->toConversationArray($user);
        })->concat($groups->map(function (Group $group) use ($user) {
            return $group->toConversationArray($user);
        }))->sortByDesc('last_message_date')->values();
    }
}