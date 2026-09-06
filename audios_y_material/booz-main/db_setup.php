<?php

// db_setup.php

$host = '127.0.0.1';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

try {
    // 1. Connect to MySQL Server (without database)
    $dsn = "mysql:host=$host;charset=$charset";
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];
    $pdo = new PDO($dsn, $user, $pass, $options);

    // 2. Create database
    $pdo->exec('CREATE DATABASE IF NOT EXISTS `booz_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');

    // 3. Connect to the database
    $pdo->exec('USE `booz_db`');

    // 4. Create Users Table
    $pdo->exec("CREATE TABLE IF NOT EXISTS `users` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `username` VARCHAR(50) UNIQUE NOT NULL,
        `password` VARCHAR(255) NOT NULL,
        `role` VARCHAR(20) DEFAULT 'admin',
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;");

    // 5. Create Products Table
    $pdo->exec('CREATE TABLE IF NOT EXISTS `products` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `name` VARCHAR(100) NOT NULL,
        `line_id` INT NOT NULL,
        `line_name` VARCHAR(50) NOT NULL,
        `description` TEXT NOT NULL,
        `active_ingredients` VARCHAR(255) NOT NULL,
        `price` DECIMAL(10,2) NOT NULL,
        `stock` INT DEFAULT 10,
        `image_path` VARCHAR(255) NOT NULL,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;');

    // 6. Create Testimonials Table
    $pdo->exec('CREATE TABLE IF NOT EXISTS `testimonials` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `quote` TEXT NOT NULL,
        `author_name` VARCHAR(100) NOT NULL,
        `author_role` VARCHAR(100) NOT NULL,
        `avatar_path` VARCHAR(255) NOT NULL,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;');

    // 7. Create FAQs Table
    $pdo->exec('CREATE TABLE IF NOT EXISTS `faqs` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `question` TEXT NOT NULL,
        `answer` TEXT NOT NULL,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;');

    // 8. Create Messages Table (Consultas, Reportes, Contacto)
    $pdo->exec("CREATE TABLE IF NOT EXISTS `messages` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `type` VARCHAR(50) NOT NULL, -- 'consulta', 'reportar', 'contacto'
        `name` VARCHAR(100) NOT NULL,
        `email` VARCHAR(100) NOT NULL,
        `phone` VARCHAR(20) DEFAULT NULL,
        `message` TEXT NOT NULL,
        `status` VARCHAR(20) DEFAULT 'Pendiente', -- 'Pendiente', 'Leído', 'Resuelto'
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;");

    // 9. Create Orders Table
    $pdo->exec("CREATE TABLE IF NOT EXISTS `orders` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `customer_name` VARCHAR(100) NOT NULL,
        `customer_email` VARCHAR(100) NOT NULL,
        `customer_phone` VARCHAR(20) NOT NULL,
        `customer_address` TEXT NOT NULL,
        `total_price` DECIMAL(10,2) NOT NULL,
        `status` VARCHAR(20) DEFAULT 'Pendiente', -- 'Pendiente', 'Despachado', 'Entregado', 'Cancelado'
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;");

    // 10. Create Order Items Table
    $pdo->exec('CREATE TABLE IF NOT EXISTS `order_items` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `order_id` INT NOT NULL,
        `product_id` INT NOT NULL,
        `product_name` VARCHAR(100) NOT NULL,
        `quantity` INT NOT NULL,
        `price` DECIMAL(10,2) NOT NULL,
        FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB;');

    // Seed Data
    // Admin user
    $admin_check = $pdo->prepare("SELECT COUNT(*) FROM `users` WHERE `username` = 'admin'");
    $admin_check->execute();
    if ($admin_check->fetchColumn() == 0) {
        $hash_pass = password_hash('admin123', PASSWORD_BCRYPT);
        $stmt = $pdo->prepare("INSERT INTO `users` (`username`, `password`, `role`) VALUES ('admin', :pass, 'admin')");
        $stmt->execute(['pass' => $hash_pass]);
    }

    // Seed Products if table is empty
    $prod_check = $pdo->query('SELECT COUNT(*) FROM `products`');
    if ($prod_check->fetchColumn() == 0) {
        $products = [
            [
                'name' => 'Albemer Suspensión Oral',
                'line_id' => 1,
                'line_name' => 'Cuidado de la piel',
                'description' => 'Solución oral de amplio espectro indicada para el cuidado, protección y recuperación de la piel en diferentes condiciones. Ayuda a combatir infecciones parasitarias e inflamaciones cutáneas desde el interior.',
                'active_ingredients' => 'Albendazol 400mg / 10mL',
                'price' => 120.00,
                'stock' => 25,
                'image_path' => 'assets/img/product_1.png',
            ],
            [
                'name' => 'Dexamer Crema',
                'line_id' => 2,
                'line_name' => 'Tratamiento tópico',
                'description' => 'Crema tópica antiinflamatoria y antipruriginosa de rápida absorción. Indicada para aliviar la picazón, enrojecimiento y descamación en dermatitis y eccemas severos.',
                'active_ingredients' => 'Dexametasona 0.1% + Neomicina',
                'price' => 85.00,
                'stock' => 30,
                'image_path' => 'assets/img/product_2.png',
            ],
            [
                'name' => 'L-Fortex Bienestar',
                'line_id' => 3,
                'line_name' => 'Salud y bienestar',
                'description' => 'Suplemento de bienestar integral diseñado para fortalecer la barrera protectora de la piel y mejorar la salud general. Enriquecido con vitaminas esenciales y minerales de absorción optimizada.',
                'active_ingredients' => 'Multivitamínico + Zinc + Omega 3',
                'price' => 150.00,
                'stock' => 15,
                'image_path' => 'assets/img/product_3.png',
            ],
            [
                'name' => 'Bactrocis Cuidado Especializado',
                'line_id' => 4,
                'line_name' => 'Cuidado especializado',
                'description' => 'Tratamiento antibacteriano y regenerador de uso especializado. Formulado para el cuidado de heridas cutáneas complejas y prevención de infecciones en cirugías dermatológicas.',
                'active_ingredients' => 'Mupirocina 2%',
                'price' => 210.00,
                'stock' => 12,
                'image_path' => 'assets/img/product_4.png',
            ],
        ];

        $stmt = $pdo->prepare('INSERT INTO `products` (`name`, `line_id`, `line_name`, `description`, `active_ingredients`, `price`, `stock`, `image_path`) VALUES (:name, :line_id, :line_name, :description, :active_ingredients, :price, :stock, :image_path)');
        foreach ($products as $p) {
            $stmt->execute($p);
        }
    }

    // Seed Testimonials if empty
    $test_check = $pdo->query('SELECT COUNT(*) FROM `testimonials`');
    if ($test_check->fetchColumn() == 0) {
        $testimonials = [
            [
                'quote' => 'Excelente respaldo y eficacia comprobada en nuestros pacientes. Los tratamientos dermatológicos de BOOZ han demostrado un desempeño clínico superior en afecciones crónicas.',
                'author_name' => 'Dr. Alejandro Méndez',
                'author_role' => 'Dermatólogo - Clínica Integral',
                'avatar_path' => 'assets/img/avatar_doctor.png',
            ],
            [
                'quote' => 'Los productos de BOOZ han sido un gran apoyo en nuestro trabajo diario. Su calidad y respaldo científico marcan la diferencia en los resultados de recuperación capilar.',
                'author_name' => 'Dra. Mariana López',
                'author_role' => 'Dermatóloga y Tricóloga',
                'avatar_path' => 'assets/img/avatar_doctor.png',
            ],
            [
                'quote' => 'Confío en BOOZ porque sé que están comprometidos con la salud y el bienestar. El tratamiento para dermatitis de mi hijo funcionó en solo tres días.',
                'author_name' => 'Juan Pérez',
                'author_role' => 'Paciente Agradecido',
                'avatar_path' => 'assets/img/avatar_patient.png',
            ],
        ];
        $stmt = $pdo->prepare('INSERT INTO `testimonials` (`quote`, `author_name`, `author_role`, `avatar_path`) VALUES (:quote, :author_name, :author_role, :avatar_path)');
        foreach ($testimonials as $t) {
            $stmt->execute($t);
        }
    }

    // Seed FAQs if empty
    $faq_check = $pdo->query('SELECT COUNT(*) FROM `faqs`');
    if ($faq_check->fetchColumn() == 0) {
        $faqs = [
            [
                'question' => '¿Dónde puedo encontrar información de un producto?',
                'answer' => 'Toda la información técnica detallada, indicaciones, dosificación e ingredientes activos de nuestros productos se encuentra disponible en la sección de Productos en este sitio web, o consultando directamente con Booz, nuestro asistente virtual interactivo.',
            ],
            [
                'question' => '¿Cómo puedo conocer las presentaciones disponibles?',
                'answer' => 'En el catálogo de productos o en la tienda digital, cada producto especifica sus presentaciones (ej. Albemer 10ml, Dexamer Crema 20g). También puedes descargarte la ficha técnica de cada uno en PDF.',
            ],
            [
                'question' => '¿Dónde puedo comprar productos BOOZ?',
                'answer' => 'Nuestros productos están disponibles a través de nuestra red de farmacias autorizadas y clínicas dermatológicas aliadas a nivel nacional. También puedes realizar un pedido digital directamente en nuestra tienda en línea para entrega express.',
            ],
            [
                'question' => '¿Cómo puedo realizar una consulta o reporte?',
                'answer' => 'Puedes escribirnos directamente a través de nuestro formulario "Estamos para escucharte" en la parte inferior de la página, seleccionando la categoría adecuada (Consultas, Reportes de Farmacovigilancia, o Contacto General).',
            ],
            [
                'question' => '¿Dónde puedo encontrar fichas técnicas?',
                'answer' => 'Las fichas técnicas y documentos de seguridad química/farmacéutica están disponibles en la sección "Conocimiento" y en la pestaña de detalles de cada producto en la tienda.',
            ],
        ];
        $stmt = $pdo->prepare('INSERT INTO `faqs` (`question`, `answer`) VALUES (:question, :answer)');
        foreach ($faqs as $f) {
            $stmt->execute($f);
        }
    }

    echo json_encode([
        'status' => 'success',
        'message' => '¡Base de datos booz_db configurada correctamente con tablas y datos semilla creados!',
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Error de Base de Datos: '.$e->getMessage(),
    ]);
}
