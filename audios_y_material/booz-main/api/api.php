<?php
// api/api.php
header('Content-Type: application/json');
include '../config/db.php';

// Check if action parameter is present
$action = isset($_GET['action']) ? $_GET['action'] : (isset($_POST['action']) ? $_POST['action'] : '');

if (empty($action)) {
    // If request is JSON post
    $raw_data = file_get_contents('php://input');
    $decoded = json_decode($raw_data, true);
    if ($decoded && isset($decoded['action'])) {
        $action = $decoded['action'];
        $_POST = $decoded; // Populate $_POST with json data for convenience
    }
}

try {
    switch ($action) {
        
        case 'get_products':
            $line_id = isset($_GET['line_id']) ? $_GET['line_id'] : 'all';
            
            if ($line_id === 'all') {
                $stmt = $pdo->query("SELECT * FROM `products` ORDER BY `id` ASC");
            } else {
                $stmt = $pdo->prepare("SELECT * FROM `products` WHERE `line_id` = :line_id ORDER BY `id` ASC");
                $stmt->execute(['line_id' => (int)$line_id]);
            }
            $products = $stmt->fetchAll();
            echo json_encode(['status' => 'success', 'data' => $products]);
            break;

        case 'get_testimonials':
            $stmt = $pdo->query("SELECT * FROM `testimonials` ORDER BY `id` DESC");
            $testimonials = $stmt->fetchAll();
            echo json_encode(['status' => 'success', 'data' => $testimonials]);
            break;

        case 'get_faqs':
            $stmt = $pdo->query("SELECT * FROM `faqs` ORDER BY `id` ASC");
            $faqs = $stmt->fetchAll();
            echo json_encode(['status' => 'success', 'data' => $faqs]);
            break;

        case 'submit_form':
            $type = isset($_POST['type']) ? trim($_POST['type']) : '';
            $name = isset($_POST['name']) ? trim($_POST['name']) : '';
            $email = isset($_POST['email']) ? trim($_POST['email']) : '';
            $phone = isset($_POST['phone']) ? trim($_POST['phone']) : null;
            $message = isset($_POST['message']) ? trim($_POST['message']) : '';

            if (empty($type) || empty($name) || empty($email) || empty($message)) {
                echo json_encode(['status' => 'error', 'message' => 'Todos los campos obligatorios deben ser completados.']);
                exit;
            }

            $stmt = $pdo->prepare("INSERT INTO `messages` (`type`, `name`, `email`, `phone`, `message`, `status`) VALUES (:type, :name, :email, :phone, :message, 'Pendiente')");
            $stmt->execute([
                'type' => $type,
                'name' => $name,
                'email' => $email,
                'phone' => $phone,
                'message' => $message
            ]);

            echo json_encode(['status' => 'success', 'message' => '¡Tu mensaje ha sido enviado con éxito! En breve nos pondremos en contacto.']);
            break;

        case 'submit_order':
            $name = isset($_POST['name']) ? trim($_POST['name']) : '';
            $email = isset($_POST['email']) ? trim($_POST['email']) : '';
            $phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
            $address = isset($_POST['address']) ? trim($_POST['address']) : '';
            $items = isset($_POST['items']) ? $_POST['items'] : [];

            if (empty($name) || empty($email) || empty($phone) || empty($address) || empty($items)) {
                echo json_encode(['status' => 'error', 'message' => 'Datos de despacho o del carrito incompletos.']);
                exit;
            }

            // Calculate Total Price
            $total_price = 0;
            $products_to_insert = [];

            // Query product prices from DB to ensure validity
            foreach ($items as $item) {
                $pid = (int)$item['id'];
                $qty = (int)$item['qty'];
                
                $stmt = $pdo->prepare("SELECT * FROM `products` WHERE `id` = :id");
                $stmt->execute(['id' => $pid]);
                $product = $stmt->fetch();

                if ($product) {
                    $item_price = $product['price'];
                    $total_price += $item_price * $qty;
                    $products_to_insert[] = [
                        'product_id' => $product['id'],
                        'product_name' => $product['name'],
                        'quantity' => $qty,
                        'price' => $item_price
                    ];
                }
            }

            if (empty($products_to_insert)) {
                echo json_encode(['status' => 'error', 'message' => 'El carrito contiene productos inválidos.']);
                exit;
            }

            // Start Transaction
            $pdo->beginTransaction();

            // Insert into orders
            $stmt = $pdo->prepare("INSERT INTO `orders` (`customer_name`, `customer_email`, `customer_phone`, `customer_address`, `total_price`, `status`) VALUES (:name, :email, :phone, :address, :total_price, 'Pendiente')");
            $stmt->execute([
                'name' => $name,
                'email' => $email,
                'phone' => $phone,
                'address' => $address,
                'total_price' => $total_price
            ]);
            $order_id = $pdo->lastInsertId();

            // Insert items & decrease stock
            $item_stmt = $pdo->prepare("INSERT INTO `order_items` (`order_id`, `product_id`, `product_name`, `quantity`, `price`) VALUES (:order_id, :product_id, :product_name, :qty, :price)");
            $stock_stmt = $pdo->prepare("UPDATE `products` SET `stock` = `stock` - :qty WHERE `id` = :id AND `stock` >= :qty");

            foreach ($products_to_insert as $item) {
                $item_stmt->execute([
                    'order_id' => $order_id,
                    'product_id' => $item['product_id'],
                    'product_name' => $item['product_name'],
                    'qty' => $item['quantity'],
                    'price' => $item['price']
                ]);
                
                // Subtract stock
                $stock_stmt->execute([
                    'qty' => $item['quantity'],
                    'id' => $item['product_id']
                ]);
            }

            $pdo->commit();

            echo json_encode([
                'status' => 'success',
                'order_id' => $order_id,
                'message' => '¡Tu pedido #' . $order_id . ' ha sido recibido con éxito! Hemos enviado un correo con el detalle.'
            ]);
            break;

        case 'chatbot_query':
            $message = isset($_POST['message']) ? trim($_POST['message']) : '';
            if (empty($message)) {
                echo json_encode(['status' => 'error', 'message' => 'Mensaje vacío.']);
                exit;
            }

            $response = chatbot_logic($message, $pdo);
            echo json_encode(['status' => 'success', 'reply' => $response]);
            break;

        default:
            echo json_encode(['status' => 'error', 'message' => 'Acción no válida.']);
            break;
    }
} catch (Exception $e) {
    if ($pdo && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    echo json_encode(['status' => 'error', 'message' => 'Error del servidor: ' . $e->getMessage()]);
}

// Chatbot Keyword & Response Engine
function chatbot_logic($query, $pdo) {
    $q = mb_strtolower($query, 'UTF-8');
    
    // 1. Search in DB products
    $stmt = $pdo->query("SELECT * FROM `products`");
    $products = $stmt->fetchAll();
    
    // Product details lookup
    foreach ($products as $p) {
        $name_lower = mb_strtolower($p['name'], 'UTF-8');
        $ingredients_lower = mb_strtolower($p['active_ingredients'], 'UTF-8');
        
        // Match specific product names
        if (strpos($name_lower, 'albemer') !== false && strpos($q, 'albemer') !== false) {
            return "<strong>" . $p['name'] . "</strong> es una suspensión oral formulada para el " . mb_strtolower($p['line_name']) . ". Su principio activo es <strong>" . $p['active_ingredients'] . "</strong>. Está indicado para: " . $p['description'] . " El precio actual es de $" . $p['price'] . " CLP. ¿Te gustaría agregarlo al carrito?";
        }
        if (strpos($name_lower, 'dexamer') !== false && strpos($q, 'dexamer') !== false) {
            return "<strong>" . $p['name'] . "</strong> es un " . mb_strtolower($p['line_name']) . " en crema. Contiene <strong>" . $p['active_ingredients'] . "</strong>. Está indicado para el alivio de picazón, inflamación y eccemas. Su precio es de $" . $p['price'] . " CLP. ¿Te ayudo a adquirirlo?";
        }
        if (strpos($name_lower, 'fortex') !== false && (strpos($q, 'fortex') !== false || strpos($q, 'l-fortex') !== false)) {
            return "<strong>" . $p['name'] . "</strong> es parte de nuestra línea de " . mb_strtolower($p['line_name']) . ". Contiene <strong>" . $p['active_ingredients'] . "</strong>. Es un excelente suplemento para fortalecer las defensas y la piel. Cuesta $" . $p['price'] . " CLP.";
        }
        if (strpos($name_lower, 'bactrocis') !== false && strpos($q, 'bactrocis') !== false) {
            return "<strong>" . $p['name'] . "</strong> es un " . mb_strtolower($p['line_name']) . " a base de <strong>" . $p['active_ingredients'] . "</strong>. Está diseñado para prevenir infecciones y regenerar heridas cutáneas complejas. El valor es de $" . $p['price'] . " CLP.";
        }
    }

    // 2. Line of products queries
    if (strpos($q, 'cuidado de la piel') !== false || strpos($q, 'línea 1') !== false || strpos($q, 'linea 1') !== false || (strpos($q, 'piel') !== false && strpos($q, 'cuidado') !== false)) {
        return "Nuestra línea de <strong>Cuidado de la Piel</strong> está liderada por <strong>Albemer Suspensión Oral</strong>. Diseñada para proteger y recuperar la piel desde el interior en diversas condiciones clínicas.";
    }
    if (strpos($q, 'tratamiento') !== false || strpos($q, 'línea 2') !== false || strpos($q, 'linea 2') !== false) {
        return "La línea de <strong>Tratamiento Tópico</strong> incluye la crema <strong>Dexamer</strong>, excelente para aliviar eccemas, inflamaciones de la piel y reacciones alérgicas de forma localizada.";
    }
    if (strpos($q, 'bienestar') !== false || strpos($q, 'salud') !== false || strpos($q, 'línea 3') !== false || strpos($q, 'linea 3') !== false) {
        return "La línea de <strong>Salud y Bienestar</strong> cuenta con <strong>L-Fortex Bienestar</strong>. Es un suplemento de zinc y vitaminas esenciales para nutrir la barrera epidérmica.";
    }
    if (strpos($q, 'especializado') !== false || strpos($q, 'línea 4') !== false || strpos($q, 'linea 4') !== false) {
        return "Nuestra línea de <strong>Cuidado Especializado</strong> incluye <strong>Bactrocis</strong>, una pomada con mupirocina al 2% para infecciones bacterianas secundarias y curación de heridas complejas.";
    }

    // 3. Generic flows
    if (strpos($q, 'hola') !== false || strpos($q, 'buenos dias') !== false || strpos($q, 'buenas tardes') !== false || strpos($q, 'buenas noches') !== false) {
        return "¡Hola! Un gusto saludarte. Soy Booz, tu asistente veterinario/químico. ¿Deseas consultar sobre algún producto, realizar un pedido en la tienda o saber más del laboratorio?";
    }
    if (strpos($q, 'tienda') !== false || strpos($q, 'comprar') !== false || strpos($q, 'precio') !== false || strpos($q, 'carro') !== false || strpos($q, 'carrito') !== false) {
        return "Puedes abrir nuestra tienda digital haciendo clic en el botón 'Tienda' en el menú superior o haciendo <a href='#' onclick='closeChat(); openStore(\"all\"); return false;'>clic aquí</a>. ¡Hacemos envíos rápidos a tu domicilio!";
    }
    if (strpos($q, 'contacto') !== false || strpos($q, 'teléfono') !== false || strpos($q, 'correo') !== false || strpos($q, 'dirección') !== false || strpos($q, 'donde están') !== false) {
        return "Puedes contactarnos completando el formulario al final de esta página o escribiéndonos a <strong>contacto@booz.com</strong>. Nuestro laboratorio central está ubicado en Santiago, Chile.";
    }
    if (strpos($q, 'gracias') !== false || strpos($q, 'chao') !== false || strpos($q, 'adios') !== false) {
        return "¡De nada! Aquí estaré siempre para ayudarte. ¡Guau! 🐾 Que tengas un excelente día.";
    }

    // Default Fallback
    return "Mmm, no estoy seguro de comprender tu pregunta completa. 🐾 Puedes consultarme sobre nuestros productos (<strong>Albemer, Dexamer, L-Fortex, Bactrocis</strong>), nuestras 4 líneas de investigación o cómo realizar una compra. ¿Qué te gustaría saber?";
}
?>
