<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Message>
 */
class MessageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $receiverId = null;
        $groupId = null;
        
        if ($this->faker->boolean(50)) {
            
            $groupId = $this->faker->randomElement(\App\Models\Group::pluck('id')->toArray());
            $group = \App\Models\Group::find($groupId);
            $senderId = $this->faker->randomElement($group->users->pluck('id')->toArray());
        } else {
            
            $senderId = $this->faker->randomElement(\App\Models\User::pluck('id')->toArray());
            do {
                $receiverId = $this->faker->randomElement(\App\Models\User::pluck('id')->toArray());
            } while ($receiverId == $senderId);
        }



        return [
            'sender_id' => $senderId ,
            'receiver_id' => $receiverId ,
            'group_id' => $groupId ,
            'message' => $this->faker->realText(200),
            'created_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
        ];
    }
}
