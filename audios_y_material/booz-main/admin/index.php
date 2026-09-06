<?php
// admin/index.php
session_start();
require_once '../config/db.php';

// --- Authentication Handler ---
$error_msg = '';
if (isset($_POST['login'])) {
    $username = trim($_POST['username']);
    $password = trim($_POST['password']);

    if (! empty($username) && ! empty($password)) {
        $stmt = $pdo->prepare('SELECT * FROM `users` WHERE `username` = :username');
        $stmt->execute(['username' => $username]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password'])) {
            $_SESSION['admin_logged'] = true;
            $_SESSION['admin_username'] = $user['username'];
            header('Location: index.php');
            exit;
        } else {
            $error_msg = 'Usuario o contraseña incorrectos.';
        }
    } else {
        $error_msg = 'Por favor, completa todos los campos.';
    }
}

// Log out handler
if (isset($_GET['action']) && $_GET['action'] === 'logout') {
    $_SESSION = [];
    session_destroy();
    header('Location: index.php');
    exit;
}

// --- AJAX API Handlers (CRUD operations) ---
if (isset($_SESSION['admin_logged']) && $_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['api'])) {
    header('Content-Type: application/json');
    $api_action = $_GET['api'];

    try {
        if ($api_action === 'save_product') {
            $id = isset($_POST['id']) ? (int) $_POST['id'] : 0;
            $name = trim($_POST['name']);
            $line_id = (int) $_POST['line_id'];
            $description = trim($_POST['description']);
            $active_ingredients = trim($_POST['active_ingredients']);
            $price = (float) $_POST['price'];
            $stock = (int) $_POST['stock'];

            // Handle image path/upload
            $image_path = isset($_POST['image_path_txt']) ? trim($_POST['image_path_txt']) : 'assets/img/product_1.png';
            if (isset($_FILES['image_file']) && $_FILES['image_file']['error'] === UPLOAD_ERR_OK) {
                $file_tmp = $_FILES['image_file']['tmp_name'];
                $file_name = preg_replace('/[^a-zA-Z0-9_.-]/', '', $_FILES['image_file']['name']);
                $dest = '../assets/img/'.$file_name;
                if (move_uploaded_file($file_tmp, $dest)) {
                    $image_path = 'assets/img/'.$file_name;
                }
            }

            // Map line names
            $line_names = [
                1 => 'Cuidado de la piel',
                2 => 'Tratamiento tópico',
                3 => 'Salud y bienestar',
                4 => 'Cuidado especializado',
            ];
            $line_name = isset($line_names[$line_id]) ? $line_names[$line_id] : 'General';

            if ($id > 0) {
                // Update
                $stmt = $pdo->prepare('UPDATE `products` SET `name` = :name, `line_id` = :line_id, `line_name` = :line_name, `description` = :description, `active_ingredients` = :active_ingredients, `price` = :price, `stock` = :stock, `image_path` = :image_path WHERE `id` = :id');
                $stmt->execute([
                    'name' => $name, 'line_id' => $line_id, 'line_name' => $line_name,
                    'description' => $description, 'active_ingredients' => $active_ingredients,
                    'price' => $price, 'stock' => $stock, 'image_path' => $image_path, 'id' => $id,
                ]);
            } else {
                // Create
                $stmt = $pdo->prepare('INSERT INTO `products` (`name`, `line_id`, `line_name`, `description`, `active_ingredients`, `price`, `stock`, `image_path`) VALUES (:name, :line_id, :line_name, :description, :active_ingredients, :price, :stock, :image_path)');
                $stmt->execute([
                    'name' => $name, 'line_id' => $line_id, 'line_name' => $line_name,
                    'description' => $description, 'active_ingredients' => $active_ingredients,
                    'price' => $price, 'stock' => $stock, 'image_path' => $image_path,
                ]);
            }
            echo json_encode(['status' => 'success']);
            exit;
        }

        if ($api_action === 'delete_product') {
            $id = (int) $_POST['id'];
            $stmt = $pdo->prepare('DELETE FROM `products` WHERE `id` = :id');
            $stmt->execute(['id' => $id]);
            echo json_encode(['status' => 'success']);
            exit;
        }

        if ($api_action === 'save_testimonial') {
            $id = isset($_POST['id']) ? (int) $_POST['id'] : 0;
            $quote = trim($_POST['quote']);
            $author_name = trim($_POST['author_name']);
            $author_role = trim($_POST['author_role']);
            $avatar_path = isset($_POST['avatar_path']) ? trim($_POST['avatar_path']) : 'assets/img/avatar_doctor.png';

            if ($id > 0) {
                $stmt = $pdo->prepare('UPDATE `testimonials` SET `quote` = :quote, `author_name` = :author_name, `author_role` = :author_role, `avatar_path` = :avatar_path WHERE `id` = :id');
                $stmt->execute(['quote' => $quote, 'author_name' => $author_name, 'author_role' => $author_role, 'avatar_path' => $avatar_path, 'id' => $id]);
            } else {
                $stmt = $pdo->prepare('INSERT INTO `testimonials` (`quote`, `author_name`, `author_role`, `avatar_path`) VALUES (:quote, :author_name, :author_role, :avatar_path)');
                $stmt->execute(['quote' => $quote, 'author_name' => $author_name, 'author_role' => $author_role, 'avatar_path' => $avatar_path]);
            }
            echo json_encode(['status' => 'success']);
            exit;
        }

        if ($api_action === 'delete_testimonial') {
            $id = (int) $_POST['id'];
            $stmt = $pdo->prepare('DELETE FROM `testimonials` WHERE `id` = :id');
            $stmt->execute(['id' => $id]);
            echo json_encode(['status' => 'success']);
            exit;
        }

        if ($api_action === 'save_faq') {
            $id = isset($_POST['id']) ? (int) $_POST['id'] : 0;
            $question = trim($_POST['question']);
            $answer = trim($_POST['answer']);

            if ($id > 0) {
                $stmt = $pdo->prepare('UPDATE `faqs` SET `question` = :question, `answer` = :answer WHERE `id` = :id');
                $stmt->execute(['question' => $question, 'answer' => $answer, 'id' => $id]);
            } else {
                $stmt = $pdo->prepare('INSERT INTO `faqs` (`question`, `answer`) VALUES (:question, :answer)');
                $stmt->execute(['question' => $question, 'answer' => $answer]);
            }
            echo json_encode(['status' => 'success']);
            exit;
        }

        if ($api_action === 'delete_faq') {
            $id = (int) $_POST['id'];
            $stmt = $pdo->prepare('DELETE FROM `faqs` WHERE `id` = :id');
            $stmt->execute(['id' => $id]);
            echo json_encode(['status' => 'success']);
            exit;
        }

        if ($api_action === 'update_message') {
            $id = (int) $_POST['id'];
            $status = trim($_POST['status']);
            $stmt = $pdo->prepare('UPDATE `messages` SET `status` = :status WHERE `id` = :id');
            $stmt->execute(['status' => $status, 'id' => $id]);
            echo json_encode(['status' => 'success']);
            exit;
        }

        if ($api_action === 'delete_message') {
            $id = (int) $_POST['id'];
            $stmt = $pdo->prepare('DELETE FROM `messages` WHERE `id` = :id');
            $stmt->execute(['id' => $id]);
            echo json_encode(['status' => 'success']);
            exit;
        }

        if ($api_action === 'update_order') {
            $id = (int) $_POST['id'];
            $status = trim($_POST['status']);
            $stmt = $pdo->prepare('UPDATE `orders` SET `status` = :status WHERE `id` = :id');
            $stmt->execute(['status' => $status, 'id' => $id]);
            echo json_encode(['status' => 'success']);
            exit;
        }

    } catch (Exception $e) {
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        exit;
    }
}

// --- RENDER LOGIN PAGE IF NOT LOGGED IN ---
if (! isset($_SESSION['admin_logged'])) {
    ?>
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login Administrador | BOOZ Laboratorio</title>
        <link rel="stylesheet" href="../assets/css/style.css">
        <style>
            body {
                background: linear-gradient(135deg, #051937 0%, #004d7a 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
            }
            .login-card {
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                border-radius: 24px;
                padding: 40px;
                width: 100%;
                max-width: 420px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            }
            .login-header {
                text-align: center;
                margin-bottom: 30px;
            }
            .login-header svg {
                width: 60px;
                height: 60px;
                margin-bottom: 12px;
            }
            .error-box {
                background-color: #FEE2E2;
                color: #B91C1C;
                padding: 12px;
                border-radius: 8px;
                font-size: 0.85rem;
                margin-bottom: 20px;
                text-align: center;
                border: 1px solid #FCA5A5;
            }
        </style>
    </head>
    <body>
        <div class="login-card">
            <div class="login-header">
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <polygon points="50,10 90,85 10,85" fill="none" stroke="#062A6B" stroke-width="8" stroke-linejoin="round"/>
                    <line x1="50" y1="10" x2="50" y2="85" stroke="#062A6B" stroke-width="6"/>
                    <line x1="30" y1="50" x2="70" y2="50" stroke="#00A896" stroke-width="6"/>
                    <circle cx="50" cy="50" r="10" fill="#062A6B"/>
                </svg>
                <h2 style="color: var(--primary); font-family: var(--font-outfit);">BOOZ ADMINISTRADOR</h2>
                <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 4px;">Acceso al panel interno del laboratorio</p>
            </div>
            
            <?php if (! empty($error_msg)) { ?>
                <div class="error-box"><?php echo $error_msg; ?></div>
            <?php } ?>

            <form action="index.php" method="POST" class="contact-form">
                <div class="form-group">
                    <label for="username">Usuario</label>
                    <input type="text" id="username" name="username" required placeholder="admin" autofocus>
                </div>
                <div class="form-group" style="margin-bottom: 20px;">
                    <label for="password">Contraseña</label>
                    <input type="password" id="password" name="password" required placeholder="••••••••">
                </div>
                <button type="submit" name="login" class="btn btn-primary" style="width: 100%;">Iniciar Sesión</button>
            </form>
            <div style="text-align: center; margin-top: 20px;">
                <a href="../index.php" style="font-size: 0.85rem; color: var(--secondary); font-weight: 600;">&larr; Volver al Sitio Público</a>
            </div>
        </div>
    </body>
    </html>
    <?php
    exit;
}

// --- RENDER ADMIN CONTROL PANEL LAYOUT ---
$page = isset($_GET['page']) ? $_GET['page'] : 'dashboard';
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Administrador | BOOZ Laboratorio</title>
    <link rel="stylesheet" href="../assets/css/style.css">
    <style>
        .admin-nav-item.active {
            background-color: var(--secondary);
            color: #FFFFFF !important;
        }
        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
        }
        .img-preview-box {
            width: 80px;
            height: 80px;
            border-radius: 8px;
            border: 1px dashed var(--border-color);
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            margin-top: 10px;
        }
        .img-preview-box img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
        }
    </style>
</head>
<body>

<div class="admin-layout">
    <!-- Sidebar -->
    <div class="admin-sidebar">
        <div>
            <div class="logo" style="margin-bottom: 20px;">
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width: 32px; height: 32px;">
                    <polygon points="50,10 90,85 10,85" fill="none" stroke="#FFFFFF" stroke-width="8" stroke-linejoin="round"/>
                    <line x1="50" y1="10" x2="50" y2="85" stroke="#FFFFFF" stroke-width="6"/>
                    <circle cx="50" cy="50" r="10" fill="#FFFFFF"/>
                </svg>
                <div class="logo-text" style="color: #FFFFFF; font-size: 1.15rem;">
                    BOOZ
                    <span style="color: var(--secondary); font-size: 0.65rem;">ADMIN PANEL</span>
                </div>
            </div>
            <div class="admin-nav">
                <a href="index.php?page=dashboard" class="admin-nav-item <?php echo $page === 'dashboard' ? 'active' : ''; ?>">
                    Panel General
                </a>
                <a href="index.php?page=products" class="admin-nav-item <?php echo $page === 'products' ? 'active' : ''; ?>">
                    Productos (CRUD)
                </a>
                <a href="index.php?page=testimonials" class="admin-nav-item <?php echo $page === 'testimonials' ? 'active' : ''; ?>">
                    Testimonios
                </a>
                <a href="index.php?page=faqs" class="admin-nav-item <?php echo $page === 'faqs' ? 'active' : ''; ?>">
                    Preguntas Frecuentes
                </a>
                <a href="index.php?page=messages" class="admin-nav-item <?php echo $page === 'messages' ? 'active' : ''; ?>">
                    Mensajes y Reportes
                </a>
                <a href="index.php?page=orders" class="admin-nav-item <?php echo $page === 'orders' ? 'active' : ''; ?>">
                    Pedidos Recibidos
                </a>
            </div>
        </div>
        <div>
            <div style="font-size: 0.8rem; color: #94A3B8; margin-bottom: 12px;">Sesión: <?php echo $_SESSION['admin_username']; ?></div>
            <a href="index.php?action=logout" class="btn btn-light" style="width: 100%; border-radius: 8px;">Cerrar Sesión</a>
        </div>
    </div>

    <!-- Main Content Panel -->
    <div class="admin-main">
        
        <?php if ($page === 'dashboard') { ?>
            <!-- DASHBOARD VIEW -->
            <?php
            // Fetch stats
            $p_count = $pdo->query('SELECT COUNT(*) FROM products')->fetchColumn();
            $o_pending = $pdo->query("SELECT COUNT(*) FROM orders WHERE status = 'Pendiente'")->fetchColumn();
            $o_total = $pdo->query('SELECT COUNT(*) FROM orders')->fetchColumn();
            $m_pending = $pdo->query("SELECT COUNT(*) FROM messages WHERE status = 'Pendiente'")->fetchColumn();
            ?>
            <div class="admin-header">
                <div>
                    <h1 style="color: var(--primary);">Bienvenido al Panel General</h1>
                    <p style="color: var(--text-muted);">Resumen operativo y estadísticas rápidas del laboratorio.</p>
                </div>
                <div class="admin-user-info">
                    <span style="font-weight:600;"><?php echo $_SESSION['admin_username']; ?></span>
                    <div class="admin-user-avatar">A</div>
                </div>
            </div>

            <div class="admin-stats-grid">
                <div class="admin-stat-card">
                    <div class="stat-info">
                        <h3><?php echo $p_count; ?></h3>
                        <p>Productos en Catálogo</p>
                    </div>
                    <div class="stat-icon">📦</div>
                </div>
                <div class="admin-stat-card">
                    <div class="stat-info">
                        <h3><?php echo $o_pending; ?></h3>
                        <p>Pedidos Pendientes</p>
                    </div>
                    <div class="stat-icon">⏳</div>
                </div>
                <div class="admin-stat-card">
                    <div class="stat-info">
                        <h3><?php echo $o_total; ?></h3>
                        <p>Pedidos Totales</p>
                    </div>
                    <div class="stat-icon">🛒</div>
                </div>
                <div class="admin-stat-card">
                    <div class="stat-info">
                        <h3><?php echo $m_pending; ?></h3>
                        <p>Mensajes Pendientes</p>
                    </div>
                    <div class="stat-icon">✉️</div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 30px;">
                <!-- Recent Orders -->
                <div class="admin-table-container">
                    <div style="padding: 20px 24px; border-bottom: 1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center;">
                        <h3 style="color: var(--primary);">Pedidos Recientes</h3>
                        <a href="index.php?page=orders" style="font-size: 0.85rem; color: var(--secondary); font-weight: 600;">Ver todos &rarr;</a>
                    </div>
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Cliente</th>
                                <th>Total</th>
                                <th>Estado</th>
                                <th>Fecha</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php
                            $stmt = $pdo->query('SELECT * FROM orders ORDER BY id DESC LIMIT 5');
            $recent_orders = $stmt->fetchAll();
            if (count($recent_orders) == 0) {
                ?>
                                <tr><td colspan="5" style="text-align:center; color: var(--text-muted);">No hay pedidos registrados aún.</td></tr>
                            <?php } else {
                                foreach ($recent_orders as $ord) { ?>
                                <tr>
                                    <td>#<?php echo $ord['id']; ?></td>
                                    <td><?php echo htmlspecialchars($ord['customer_name']); ?></td>
                                    <td>$<?php echo $ord['total_price']; ?></td>
                                    <td><span class="status-badge status-<?php echo strtolower($ord['status']); ?>"><?php echo $ord['status']; ?></span></td>
                                    <td><?php echo date('d-m-Y H:i', strtotime($ord['created_at'])); ?></td>
                                </tr>
                            <?php }
                                } ?>
                        </tbody>
                    </table>
                </div>

                <!-- Recent Messages -->
                <div class="admin-table-container">
                    <div style="padding: 20px 24px; border-bottom: 1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center;">
                        <h3 style="color: var(--primary);">Mensajes</h3>
                        <a href="index.php?page=messages" style="font-size: 0.85rem; color: var(--secondary); font-weight: 600;">Ver todos &rarr;</a>
                    </div>
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Tipo</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php
                                $stmt = $pdo->query('SELECT * FROM messages ORDER BY id DESC LIMIT 5');
            $recent_msgs = $stmt->fetchAll();
            if (count($recent_msgs) == 0) {
                ?>
                                <tr><td colspan="3" style="text-align:center; color: var(--text-muted);">No hay mensajes.</td></tr>
                            <?php } else {
                                foreach ($recent_msgs as $msg) { ?>
                                <tr>
                                    <td><?php echo htmlspecialchars($msg['name']); ?></td>
                                    <td style="text-transform: capitalize;"><?php echo $msg['type']; ?></td>
                                    <td><span class="status-badge status-<?php echo strtolower($msg['status']); ?>"><?php echo $msg['status']; ?></span></td>
                                </tr>
                            <?php }
                                } ?>
                        </tbody>
                    </table>
                </div>
            </div>

        <?php } elseif ($page === 'products') { ?>
            <!-- PRODUCTS CRUD VIEW -->
            <div class="admin-header">
                <div>
                    <h1 style="color: var(--primary);">Catálogo de Productos</h1>
                    <p style="color: var(--text-muted);">Gestione el catálogo de medicamentos, cremas y suplementos.</p>
                </div>
                <button class="btn btn-secondary" onclick="openProductModal()">Añadir Producto</button>
            </div>

            <div class="admin-table-container">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Imagen</th>
                            <th>Nombre</th>
                            <th>Línea</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Ingredientes</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php
                        $stmt = $pdo->query('SELECT * FROM products ORDER BY id ASC');
            $products = $stmt->fetchAll();
            foreach ($products as $p) {
                ?>
                            <tr id="prod-row-<?php echo $p['id']; ?>">
                                <td><img src="../<?php echo $p['image_path']; ?>" style="width: 44px; height: 44px; object-fit: contain;"></td>
                                <td style="font-weight: 600;"><?php echo htmlspecialchars($p['name']); ?></td>
                                <td><?php echo $p['line_name']; ?></td>
                                <td style="font-weight: 700; color: var(--primary);">$<?php echo $p['price']; ?></td>
                                <td><?php echo $p['stock']; ?></td>
                                <td style="font-size: 0.8rem;"><?php echo htmlspecialchars($p['active_ingredients']); ?></td>
                                <td>
                                    <div class="admin-actions">
                                        <button class="admin-btn admin-btn-edit" onclick="editProduct(<?php echo htmlspecialchars(json_encode($p)); ?>)">Editar</button>
                                        <button class="admin-btn admin-btn-delete" onclick="deleteProduct(<?php echo $p['id']; ?>)">Eliminar</button>
                                    </div>
                                </td>
                            </tr>
                        <?php } ?>
                    </tbody>
                </table>
            </div>

            <!-- Product Save Modal -->
            <div class="admin-modal" id="product-modal">
                <div class="admin-modal-content">
                    <div class="panel-header" style="background-color: var(--primary);">
                        <h3 id="product-modal-title">Añadir Producto</h3>
                        <button class="panel-close" onclick="closeProductModal()">&times;</button>
                    </div>
                    <form id="product-form" style="padding: 24px;" class="contact-form" onsubmit="saveProduct(event)" enctype="multipart/form-data">
                        <input type="hidden" name="id" id="prod-id" value="0">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="prod-name">Nombre Comercial</label>
                                <input type="text" id="prod-name" name="name" required placeholder="Ej. Albemer Suspensión">
                            </div>
                            <div class="form-group">
                                <label for="prod-line">Línea de Producto</label>
                                <select id="prod-line" name="line_id" required>
                                    <option value="1">Cuidado de la piel (Line 1)</option>
                                    <option value="2">Tratamiento tópico (Line 2)</option>
                                    <option value="3">Salud y bienestar (Line 3)</option>
                                    <option value="4">Cuidado especializado (Line 4)</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group" style="margin-top: 10px;">
                            <label for="prod-desc">Descripción General</label>
                            <textarea id="prod-desc" name="description" required rows="3" placeholder="Fórmula e indicaciones médicas..."></textarea>
                        </div>
                        <div class="form-group" style="margin-top: 10px;">
                            <label for="prod-ingredients">Ingredientes Activos</label>
                            <input type="text" id="prod-ingredients" name="active_ingredients" required placeholder="Ej. Albendazol 400mg / 10mL">
                        </div>
                        <div class="form-row" style="margin-top: 10px;">
                            <div class="form-group">
                                <label for="prod-price">Precio ($)</label>
                                <input type="number" id="prod-price" name="price" step="0.01" required placeholder="120.00">
                            </div>
                            <div class="form-group">
                                <label for="prod-stock">Stock Inicial</label>
                                <input type="number" id="prod-stock" name="stock" required placeholder="10">
                            </div>
                        </div>
                        <div class="form-group" style="margin-top: 10px;">
                            <label for="prod-image-path">Ruta de Imagen (o selecciona una preexistente)</label>
                            <input type="text" id="prod-image-path" name="image_path_txt" value="assets/img/product_1.png">
                            <label style="margin-top: 8px;">O Subir Nueva Imagen (Sobrescribe la ruta de arriba)</label>
                            <input type="file" id="prod-image-file" name="image_file" accept="image/*">
                        </div>
                        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 20px;">Guardar Producto</button>
                    </form>
                </div>
            </div>

        <?php } elseif ($page === 'testimonials') { ?>
            <!-- TESTIMONIALS CRUD VIEW -->
            <div class="admin-header">
                <div>
                    <h1 style="color: var(--primary);">Testimonios Clínicos</h1>
                    <p style="color: var(--text-muted);">Administre las opiniones de dermatólogos y testimonios de pacientes.</p>
                </div>
                <button class="btn btn-secondary" onclick="openTestimonialModal()">Añadir Testimonio</button>
            </div>

            <div class="admin-table-container">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Autor</th>
                            <th>Rol</th>
                            <th>Testimonio</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php
                $stmt = $pdo->query('SELECT * FROM testimonials ORDER BY id DESC');
            $testimonials = $stmt->fetchAll();
            foreach ($testimonials as $t) {
                ?>
                            <tr id="test-row-<?php echo $t['id']; ?>">
                                <td style="font-weight: 600;"><?php echo htmlspecialchars($t['author_name']); ?></td>
                                <td><?php echo htmlspecialchars($t['author_role']); ?></td>
                                <td style="font-size: 0.85rem; max-width: 400px;"><?php echo htmlspecialchars($t['quote']); ?></td>
                                <td>
                                    <div class="admin-actions">
                                        <button class="admin-btn admin-btn-edit" onclick="editTestimonial(<?php echo htmlspecialchars(json_encode($t)); ?>)">Editar</button>
                                        <button class="admin-btn admin-btn-delete" onclick="deleteTestimonial(<?php echo $t['id']; ?>)">Eliminar</button>
                                    </div>
                                </td>
                            </tr>
                        <?php } ?>
                    </tbody>
                </table>
            </div>

            <!-- Testimonial Modal -->
            <div class="admin-modal" id="testimonial-modal">
                <div class="admin-modal-content">
                    <div class="panel-header">
                        <h3 id="testimonial-modal-title">Añadir Testimonio</h3>
                        <button class="panel-close" onclick="closeTestimonialModal()">&times;</button>
                    </div>
                    <form id="testimonial-form" style="padding: 24px;" class="contact-form" onsubmit="saveTestimonial(event)">
                        <input type="hidden" name="id" id="test-id" value="0">
                        <div class="form-group">
                            <label for="test-author">Nombre Completo</label>
                            <input type="text" id="test-author" name="author_name" required placeholder="Ej. Dr. Carlos Valenzuela">
                        </div>
                        <div class="form-group" style="margin-top: 10px;">
                            <label for="test-role">Rol / Cargo</label>
                            <input type="text" id="test-role" name="author_role" required placeholder="Ej. Dermatólogo - Clínica Indisa">
                        </div>
                        <div class="form-group" style="margin-top: 10px;">
                            <label for="test-quote">Mensaje del Testimonio</label>
                            <textarea id="test-quote" name="quote" required rows="4" placeholder="Cuerpo del testimonio..."></textarea>
                        </div>
                        <div class="form-group" style="margin-top: 10px;">
                            <label for="test-avatar">Avatar (Imagen de Perfil)</label>
                            <select id="test-avatar" name="avatar_path">
                                <option value="assets/img/avatar_doctor.png">Médico (Femenina)</option>
                                <option value="assets/img/avatar_patient.png">Paciente (Masculino)</option>
                            </select>
                        </div>
                        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 20px;">Guardar Testimonio</button>
                    </form>
                </div>
            </div>

        <?php } elseif ($page === 'faqs') { ?>
            <!-- FAQS CRUD VIEW -->
            <div class="admin-header">
                <div>
                    <h1 style="color: var(--primary);">Preguntas Frecuentes (FAQs)</h1>
                    <p style="color: var(--text-muted);">Administre la sección de acordeón de soporte en el portal público.</p>
                </div>
                <button class="btn btn-secondary" onclick="openFaqModal()">Añadir FAQ</button>
            </div>

            <div class="admin-table-container">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Pregunta</th>
                            <th>Respuesta</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php
                $stmt = $pdo->query('SELECT * FROM faqs ORDER BY id ASC');
            $faqs = $stmt->fetchAll();
            foreach ($faqs as $f) {
                ?>
                            <tr id="faq-row-<?php echo $f['id']; ?>">
                                <td style="font-weight: 600; width: 30%;"><?php echo htmlspecialchars($f['question']); ?></td>
                                <td style="font-size: 0.85rem;"><?php echo htmlspecialchars($f['answer']); ?></td>
                                <td>
                                    <div class="admin-actions">
                                        <button class="admin-btn admin-btn-edit" onclick="editFaq(<?php echo htmlspecialchars(json_encode($f)); ?>)">Editar</button>
                                        <button class="admin-btn admin-btn-delete" onclick="deleteFaq(<?php echo $f['id']; ?>)">Eliminar</button>
                                    </div>
                                </td>
                            </tr>
                        <?php } ?>
                    </tbody>
                </table>
            </div>

            <!-- FAQ Modal -->
            <div class="admin-modal" id="faq-modal">
                <div class="admin-modal-content">
                    <div class="panel-header">
                        <h3 id="faq-modal-title">Añadir FAQ</h3>
                        <button class="panel-close" onclick="closeFaqModal()">&times;</button>
                    </div>
                    <form id="faq-form" style="padding: 24px;" class="contact-form" onsubmit="saveFaq(event)">
                        <input type="hidden" name="id" id="faq-id" value="0">
                        <div class="form-group">
                            <label for="faq-question">Pregunta</label>
                            <input type="text" id="faq-question" name="question" required placeholder="¿Cómo puedo comprar?">
                        </div>
                        <div class="form-group" style="margin-top: 10px;">
                            <label for="faq-answer">Respuesta</label>
                            <textarea id="faq-answer" name="answer" required rows="4" placeholder="Escribe la respuesta aquí..."></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 20px;">Guardar Pregunta</button>
                    </form>
                </div>
            </div>

        <?php } elseif ($page === 'messages') { ?>
            <!-- MESSAGES AND REPORTS LOG -->
            <div class="admin-header">
                <div>
                    <h1 style="color: var(--primary);">Mensajes y Reportes de Farmacovigilancia</h1>
                    <p style="color: var(--text-muted);">Revise las consultas y reportes ingresados por médicos y pacientes.</p>
                </div>
            </div>

            <div class="admin-table-container">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Tipo</th>
                            <th>Contacto</th>
                            <th>Mensaje / Evento reportado</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php
                $stmt = $pdo->query('SELECT * FROM messages ORDER BY id DESC');
            $messages = $stmt->fetchAll();
            if (count($messages) == 0) {
                ?>
                            <tr><td colspan="6" style="text-align:center; color:var(--text-muted);">No se han recibido mensajes aún.</td></tr>
                        <?php } else {
                            foreach ($messages as $m) { ?>
                            <tr id="msg-row-<?php echo $m['id']; ?>">
                                <td style="font-weight: 600;"><?php echo htmlspecialchars($m['name']); ?></td>
                                <td style="text-transform: uppercase; font-size: 0.75rem; font-weight:700; color: var(--primary);">
                                    <?php echo $m['type']; ?>
                                </td>
                                <td style="font-size:0.8rem;">
                                    <?php echo htmlspecialchars($m['email']); ?><br>
                                    <span style="color:var(--text-muted);"><?php echo $m['phone'] ? htmlspecialchars($m['phone']) : '-'; ?></span>
                                </td>
                                <td style="font-size: 0.85rem; max-width: 350px;"><?php echo nl2br(htmlspecialchars($m['message'])); ?></td>
                                <td>
                                    <span class="status-badge status-<?php echo strtolower($m['status']); ?>"><?php echo $m['status']; ?></span>
                                </td>
                                <td>
                                    <div class="admin-actions">
                                        <?php if ($m['status'] === 'Pendiente') { ?>
                                            <button class="admin-btn admin-btn-view" onclick="resolveMessage(<?php echo $m['id']; ?>, 'Resuelto')">Resolver</button>
                                        <?php } ?>
                                        <button class="admin-btn admin-btn-delete" onclick="deleteMessage(<?php echo $m['id']; ?>)">Eliminar</button>
                                    </div>
                                </td>
                            </tr>
                        <?php }
                            } ?>
                    </tbody>
                </table>
            </div>

        <?php } elseif ($page === 'orders') { ?>
            <!-- ORDERS LOG -->
            <div class="admin-header">
                <div>
                    <h1 style="color: var(--primary);">Pedidos Recibidos (Tienda)</h1>
                    <p style="color: var(--text-muted);">Revise las solicitudes de compra del carrito digital.</p>
                </div>
            </div>

            <div class="admin-table-container">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Pedido</th>
                            <th>Cliente</th>
                            <th>Contacto / Dirección</th>
                            <th>Productos solicitados</th>
                            <th>Total</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php
                            $stmt = $pdo->query('SELECT * FROM orders ORDER BY id DESC');
            $orders = $stmt->fetchAll();

            if (count($orders) == 0) {
                ?>
                            <tr><td colspan="6" style="text-align:center; color:var(--text-muted);">No hay pedidos realizados aún.</td></tr>
                        <?php } else {
                            foreach ($orders as $o) {
                                // Fetch items for this order
                                $item_stmt = $pdo->prepare('SELECT * FROM order_items WHERE order_id = :order_id');
                                $item_stmt->execute(['order_id' => $o['id']]);
                                $items = $item_stmt->fetchAll();
                                ?>
                            <tr id="ord-row-<?php echo $o['id']; ?>">
                                <td style="font-weight: 700; color: var(--primary);">#<?php echo $o['id']; ?></td>
                                <td style="font-weight: 600;"><?php echo htmlspecialchars($o['customer_name']); ?></td>
                                <td style="font-size: 0.8rem;">
                                    <?php echo htmlspecialchars($o['customer_email']); ?><br>
                                    <?php echo htmlspecialchars($o['customer_phone']); ?><br>
                                    <span style="color: var(--text-muted);"><?php echo htmlspecialchars($o['customer_address']); ?></span>
                                </td>
                                <td style="font-size: 0.85rem;">
                                    <ul style="list-style-type: disc; padding-left: 16px;">
                                        <?php foreach ($items as $item) { ?>
                                            <li><?php echo htmlspecialchars($item['product_name']); ?> x<?php echo $item['quantity']; ?></li>
                                        <?php } ?>
                                    </ul>
                                </td>
                                <td style="font-weight: 700; color: var(--primary); font-size:1rem;">$<?php echo $o['total_price']; ?></td>
                                <td>
                                    <select onchange="updateOrderStatus(<?php echo $o['id']; ?>, this.value)" style="padding: 4px 8px; font-size:0.8rem; border-radius: 4px;">
                                        <option value="Pendiente" <?php echo $o['status'] === 'Pendiente' ? 'selected' : ''; ?>>Pendiente</option>
                                        <option value="Despachado" <?php echo $o['status'] === 'Despachado' ? 'selected' : ''; ?>>Despachado</option>
                                        <option value="Entregado" <?php echo $o['status'] === 'Entregado' ? 'selected' : ''; ?>>Entregado</option>
                                        <option value="Cancelado" <?php echo $o['status'] === 'Cancelado' ? 'selected' : ''; ?>>Cancelado</option>
                                    </select>
                                </td>
                            </tr>
                        <?php }
                            } ?>
                    </tbody>
                </table>
            </div>

        <?php } ?>

    </div>
</div>

<!-- ==========================================
     ADMIN SCRIPTS (CRUD AJAX Logic)
     ========================================== -->
<script>
    // --- Products ---
    function openProductModal() {
        document.getElementById('product-form').reset();
        document.getElementById('prod-id').value = "0";
        document.getElementById('product-modal-title').innerText = "Añadir Producto";
        document.getElementById('product-modal').style.display = 'flex';
    }

    function closeProductModal() {
        document.getElementById('product-modal').style.display = 'none';
    }

    function editProduct(prod) {
        document.getElementById('prod-id').value = prod.id;
        document.getElementById('prod-name').value = prod.name;
        document.getElementById('prod-line').value = prod.line_id;
        document.getElementById('prod-desc').value = prod.description;
        document.getElementById('prod-ingredients').value = prod.active_ingredients;
        document.getElementById('prod-price').value = prod.price;
        document.getElementById('prod-stock').value = prod.stock;
        document.getElementById('prod-image-path').value = prod.image_path;
        
        document.getElementById('product-modal-title').innerText = "Editar Producto #" + prod.id;
        document.getElementById('product-modal').style.display = 'flex';
    }

    function saveProduct(e) {
        e.preventDefault();
        const form = document.getElementById('product-form');
        const formData = new FormData(form);

        fetch('index.php?api=save_product', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(res => {
            if (res.status === 'success') {
                alert('¡Producto guardado correctamente!');
                location.reload();
            } else {
                alert('Error: ' + res.message);
            }
        })
        .catch(err => console.error(err));
    }

    function deleteProduct(id) {
        if (!confirm('¿Estás seguro de eliminar este producto?')) return;
        
        const formData = new FormData();
        formData.append('id', id);

        fetch('index.php?api=delete_product', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(res => {
            if (res.status === 'success') {
                document.getElementById('prod-row-' + id).remove();
            } else {
                alert('Error: ' + res.message);
            }
        })
        .catch(err => console.error(err));
    }

    // --- Testimonials ---
    function openTestimonialModal() {
        document.getElementById('testimonial-form').reset();
        document.getElementById('test-id').value = "0";
        document.getElementById('testimonial-modal-title').innerText = "Añadir Testimonio";
        document.getElementById('testimonial-modal').style.display = 'flex';
    }

    function closeTestimonialModal() {
        document.getElementById('testimonial-modal').style.display = 'none';
    }

    function editTestimonial(t) {
        document.getElementById('test-id').value = t.id;
        document.getElementById('test-author').value = t.author_name;
        document.getElementById('test-role').value = t.author_role;
        document.getElementById('test-quote').value = t.quote;
        document.getElementById('test-avatar').value = t.avatar_path;
        
        document.getElementById('testimonial-modal-title').innerText = "Editar Testimonio #" + t.id;
        document.getElementById('testimonial-modal').style.display = 'flex';
    }

    function saveTestimonial(e) {
        e.preventDefault();
        const form = document.getElementById('testimonial-form');
        const formData = new FormData(form);

        fetch('index.php?api=save_testimonial', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(res => {
            if (res.status === 'success') {
                alert('¡Testimonio guardado!');
                location.reload();
            } else {
                alert('Error: ' + res.message);
            }
        })
        .catch(err => console.error(err));
    }

    function deleteTestimonial(id) {
        if (!confirm('¿Seguro de eliminar este testimonio?')) return;
        
        const formData = new FormData();
        formData.append('id', id);

        fetch('index.php?api=delete_testimonial', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(res => {
            if (res.status === 'success') {
                document.getElementById('test-row-' + id).remove();
            }
        });
    }

    // --- FAQs ---
    function openFaqModal() {
        document.getElementById('faq-form').reset();
        document.getElementById('faq-id').value = "0";
        document.getElementById('faq-modal-title').innerText = "Añadir FAQ";
        document.getElementById('faq-modal').style.display = 'flex';
    }

    function closeFaqModal() {
        document.getElementById('faq-modal').style.display = 'none';
    }

    function editFaq(f) {
        document.getElementById('faq-id').value = f.id;
        document.getElementById('faq-question').value = f.question;
        document.getElementById('faq-answer').value = f.answer;
        
        document.getElementById('faq-modal-title').innerText = "Editar FAQ #" + f.id;
        document.getElementById('faq-modal').style.display = 'flex';
    }

    function saveFaq(e) {
        e.preventDefault();
        const form = document.getElementById('faq-form');
        const formData = new FormData(form);

        fetch('index.php?api=save_faq', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(res => {
            if (res.status === 'success') {
                alert('¡Pregunta guardada!');
                location.reload();
            }
        });
    }

    function deleteFaq(id) {
        if (!confirm('¿Seguro de eliminar esta FAQ?')) return;
        const formData = new FormData();
        formData.append('id', id);
        fetch('index.php?api=delete_faq', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(res => {
            if (res.status === 'success') location.reload();
        });
    }

    // --- Messages ---
    function resolveMessage(id, status) {
        const formData = new FormData();
        formData.append('id', id);
        formData.append('status', status);

        fetch('index.php?api=update_message', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(res => {
            if (res.status === 'success') location.reload();
        });
    }

    function deleteMessage(id) {
        if (!confirm('¿Seguro de eliminar este reporte/mensaje?')) return;
        const formData = new FormData();
        formData.append('id', id);
        fetch('index.php?api=delete_message', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(res => {
            if (res.status === 'success') {
                document.getElementById('msg-row-' + id).remove();
            }
        });
    }

    // --- Orders ---
    function updateOrderStatus(id, status) {
        const formData = new FormData();
        formData.append('id', id);
        formData.append('status', status);

        fetch('index.php?api=update_order', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(res => {
            if (res.status === 'success') {
                alert('¡Estado del pedido actualizado!');
            }
        });
    }
</script>
</body>
</html>
