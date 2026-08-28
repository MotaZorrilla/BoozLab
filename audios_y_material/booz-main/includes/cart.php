<?php
// includes/cart.php
?>
<div class="sidebar-panel" id="cart-panel">
    <div class="panel-header">
        <h3>
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" style="vertical-align: middle;">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-8.9-5h7.45c.75 0 1.41-.41 1.75-1.03L21 4H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7l1.1-2z"/>
            </svg>
            Tu Carrito
        </h3>
        <button class="panel-close" id="btn-close-cart">&times;</button>
    </div>
    
    <div class="cart-body">
        <!-- Cart items list (rendered via JS) -->
        <div class="cart-items-list" id="cart-items-container">
            <!-- Dynamically populated via JS -->
            <div style="text-align: center; color: var(--text-muted); margin-top: 40px;">
                <p>Tu carrito está vacío.</p>
                <button class="btn btn-light" onclick="closeCart(); openStore('all');" style="margin-top: 16px;">Ver catálogo</button>
            </div>
        </div>

        <!-- Checkout Form (revealed when checking out) -->
        <div class="checkout-form-container" id="checkout-form-container">
            <h4 style="color: var(--primary); margin-bottom: 16px; font-family: var(--font-outfit);">Datos de Despacho</h4>
            <form class="contact-form" id="cart-checkout-form" onsubmit="submitCheckout(event)">
                <div class="form-group">
                    <label for="ch_name">Nombre completo</label>
                    <input type="text" id="ch_name" required placeholder="Juan Pérez">
                </div>
                <div class="form-group">
                    <label for="ch_email">Correo electrónico</label>
                    <input type="email" id="ch_email" required placeholder="juan@ejemplo.com">
                </div>
                <div class="form-group">
                    <label for="ch_phone">Teléfono móvil</label>
                    <input type="tel" id="ch_phone" required placeholder="+56 9 1234 5678">
                </div>
                <div class="form-group">
                    <label for="ch_address">Dirección de despacho completa</label>
                    <textarea id="ch_address" rows="3" required placeholder="Calle, Número, Departamento, Comuna, Ciudad"></textarea>
                </div>
                <button type="submit" class="btn btn-secondary" style="width: 100%; margin-top: 10px;">Confirmar Pedido</button>
            </form>
        </div>
    </div>
    
    <div class="cart-footer" id="cart-footer-actions" style="display: none;">
        <div class="cart-summary">
            <span>Total:</span>
            <span id="cart-total-value">$0.00</span>
        </div>
        <button class="btn btn-primary" id="btn-goto-checkout" onclick="showCheckoutForm()" style="width: 100%;">Proceder al Pago</button>
    </div>
</div>
