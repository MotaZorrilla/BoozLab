<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class MakeAdminCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'booz:make-admin {email? : El correo del usuario a promover como administrador}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Otorga privilegios de administrador a un usuario de Booz Laboratorio';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $email = $this->argument('email') ?? 'admin@boozlaboratorio.com';

        $user = User::where('email', $email)->first();

        if (! $user) {
            $this->error("Usuario con correo [{$email}] no encontrado.");

            return self::FAILURE;
        }

        $user->is_admin = true;
        if (! $user->email_verified_at) {
            $user->email_verified_at = now();
        }
        $user->save();
        $user->assignRole('super_admin');

        $this->info("¡Éxito! El usuario [{$user->name}] ({$user->email}) ahora tiene rol de Super Administrador activo.");

        return self::SUCCESS;
    }
}
