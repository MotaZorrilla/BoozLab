<?php
// index.php
include 'includes/header.php';
?>

<!-- Hero Section -->
<section class="hero" id="hero">
    <div class="container hero-grid">
        <div class="hero-content">
            <h1>La ciencia que transforma el cuidado</h1>
            <p>Desarrollamos soluciones innovadoras y confiables para el bienestar y la recuperación cutánea.</p>
            <div class="hero-buttons">
                <button class="btn btn-primary" onclick="openStore('all')">Conoce nuestros productos</button>
                <button class="btn btn-outline" onclick="openStore('all')">¿Qué estás buscando?</button>
            </div>
        </div>
        <div class="hero-image-container">
            <img src="assets/img/hero_products.png" alt="Productos BOOZ Laboratorio">
        </div>
    </div>
</section>

<!-- Product Lines Section -->
<section class="lines-section" id="lineas">
    <div class="container">
        <h2 class="section-title">Nuestras 4 líneas de productos</h2>
        
        <div class="lines-wrapper">
            <div class="lines-carousel">
                <!-- Line 1 -->
                <div class="line-card line-1">
                    <div class="line-card-content">
                        <div class="line-icon">
                            <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                        </div>
                        <span class="line-number">01</span>
                        <h3>Cuidado de la piel</h3>
                        <p>Soluciones para el cuidado, protección y recuperación de la piel en diferentes condiciones clínicas.</p>
                    </div>
                    <img src="assets/img/product_1.png" alt="Albemer" class="line-img">
                    <button class="btn btn-line" onclick="openStore('1')">Ver productos</button>
                </div>

                <!-- Line 2 -->
                <div class="line-card line-2">
                    <div class="line-card-content">
                        <div class="line-icon">
                            <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>
                        </div>
                        <span class="line-number">02</span>
                        <h3>Tratamiento tópico</h3>
                        <p>Fórmulas dermatológicas indicadas para afecciones cutáneas localizadas, inflamación y alivio rápido.</p>
                    </div>
                    <img src="assets/img/product_2.png" alt="Dexamer" class="line-img">
                    <button class="btn btn-line" onclick="openStore('2')">Ver productos</button>
                </div>

                <!-- Line 3 -->
                <div class="line-card line-3">
                    <div class="line-card-content">
                        <div class="line-icon">
                            <svg viewBox="0 0 24 24"><path d="M12 3L2 12h3v8h14v-8h3L12 3zm0 13c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/></svg>
                        </div>
                        <span class="line-number">03</span>
                        <h3>Salud y bienestar</h3>
                        <p>Suplementos farmacéuticos y nutrientes esenciales formulados para robustecer la salud integral.</p>
                    </div>
                    <img src="assets/img/product_3.png" alt="L-Fortex" class="line-img">
                    <button class="btn btn-line" onclick="openStore('3')">Ver productos</button>
                </div>

                <!-- Line 4 -->
                <div class="line-card line-4">
                    <div class="line-card-content">
                        <div class="line-icon">
                            <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.75z"/></svg>
                        </div>
                        <span class="line-number">04</span>
                        <h3>Cuidado especializado</h3>
                        <p>Tratamientos especializados y regeneración avanzada para barreras cutáneas comprometidas o post-quirúrgicos.</p>
                    </div>
                    <img src="assets/img/product_4.png" alt="Bactrocis" class="line-img">
                    <button class="btn btn-line" onclick="openStore('4')">Ver productos</button>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Need Finder & Virtual Assistant -->
<section class="finder-section">
    <div class="container finder-grid">
        <!-- Need Finder -->
        <div class="finder-box">
            <div>
                <h2>¿Qué necesitas?</h2>
                <div class="needs-selector">
                    <div class="need-item active" data-need="cuidado">
                        <div class="need-icon">
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                        </div>
                        <span>Cuidado</span>
                    </div>
                    <div class="need-item" data-need="proteccion">
                        <div class="need-icon">
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>
                        </div>
                        <span>Protección</span>
                    </div>
                    <div class="need-item" data-need="tratamiento">
                        <div class="need-icon">
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>
                        </div>
                        <span>Tratamiento</span>
                    </div>
                    <div class="need-item" data-need="bienestar">
                        <div class="need-icon">
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3L2 12h3v8h14v-8h3L12 3zm0 13c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/></svg>
                        </div>
                        <span>Bienestar</span>
                    </div>
                    <div class="need-item" data-need="informacion">
                        <div class="need-icon">
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                        </div>
                        <span>Información</span>
                    </div>
                </div>
            </div>
            <div class="need-details" id="need-details-panel">
                <h4>Cuidado diario de la piel</h4>
                <p>Encuentra el producto ideal según tu necesidad. Ofrecemos fórmulas hidratantes, nutritivas y restauradoras para mantener la barrera cutánea sana y elástica todos los días.</p>
            </div>
        </div>

        <!-- Virtual Assistant Promo -->
        <div class="mascot-box">
            <div class="mascot-img-wrapper">
                <img src="assets/img/booz_mascot.png" alt="Mascota Virtual Booz">
            </div>
            <div class="mascot-content">
                <h3>Hola, soy Booz</h3>
                <span>Tu asistente virtual</span>
                <p>Estoy aquí para ayudarte a encontrar información sobre nuestros productos, líneas de cuidado y mucho más.</p>
                <button class="btn btn-primary btn-booz" id="btn-promo-chat">
                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
                    </svg>
                    Hablar con Booz
                </button>
            </div>
        </div>
    </div>

    <!-- Shop Promo Banner -->
    <div class="container">
        <div class="shop-promo">
            <div class="shop-promo-content">
                <h2>¿Ya sabes lo que buscas?</h2>
                <p>Encuentra nuestros productos en nuestra tienda online. Compra de forma segura con entrega a domicilio.</p>
                <button class="btn btn-shop-promo" onclick="openStore('all')">
                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" style="margin-right: 8px; vertical-align: middle;">
                        <path d="M17.21 9l-4.38-6.56c-.18-.28-.5-.44-.83-.44s-.65.16-.83.44L6.79 9H2c-.55 0-1 .45-1 1 0 .09.01.18.04.27l2.54 9.27c.23.84 1 1.46 1.88 1.46h13.08c.88 0 1.65-.62 1.88-1.46l2.54-9.27L23 10c0-.55-.45-1-1-1h-4.79zM9 9l3-4.5L15 9H9zm3 8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                    </svg>
                    Ir a la tienda
                </button>
            </div>
            <div class="shop-promo-img">
                <!-- Inline SVG shopping cart loaded with pharmaceutical products -->
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <!-- Shopping Cart -->
                    <path d="M30 60h30l20 70h70l15-50h-95" fill="none" stroke="#7F1D50" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="85" cy="155" r="15" fill="#7F1D50"/>
                    <circle cx="145" cy="155" r="15" fill="#7F1D50"/>
                    <!-- Products inside cart -->
                    <rect x="90" y="55" width="20" height="40" rx="3" fill="#062A6B" opacity="0.8"/>
                    <rect x="115" y="45" width="18" height="50" rx="2" fill="#00A896" opacity="0.9"/>
                    <polygon points="140,55 155,55 147,95 138,95" fill="#7F1D50" opacity="0.75"/>
                </svg>
            </div>
        </div>
    </div>
</section>

<!-- Science, Experience & Commitment -->
<section class="science-section" id="laboratorio">
    <div class="container">
        <div class="science-grid">
            <div class="science-content">
                <h2>Ciencia, experiencia y compromiso</h2>
                <p>En BOOZ Laboratorio trabajamos con los más altos estándares para desarrollar productos seguros, efectivos e innovadores que mejoran el cuidado dermatológico y la salud clínica.</p>
                <button class="btn btn-outline" onclick="document.getElementById('contacto').scrollIntoView();">Conoce más sobre nosotros &rarr;</button>
            </div>
            <div class="science-img-container">
                <img src="assets/img/lab_view.png" alt="Laboratorio de Investigación BOOZ">
            </div>
        </div>

        <div class="science-cards" id="conocimiento">
            <!-- Card 1 -->
            <div class="science-card">
                <div>
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
                    <h4>Evidencia</h4>
                    <p>Información científica y estudios clínicos rigurosos que respaldan la eficacia de nuestros productos.</p>
                </div>
                <a href="#" class="explore-link">Explorar &rarr;</a>
            </div>

            <!-- Card 2 -->
            <div class="science-card">
                <div>
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                    <h4>Casos de éxito</h4>
                    <p>Experiencias reales de médicos y pacientes que reflejan excelentes resultados y absoluta confianza.</p>
                </div>
                <a href="#" class="explore-link">Explorar &rarr;</a>
            </div>

            <!-- Card 3 -->
            <div class="science-card">
                <div>
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                    <h4>Conocimiento</h4>
                    <p>Artículos científicos, recomendaciones de cuidado y recursos formativos para profesionales de la salud.</p>
                </div>
                <a href="#" class="explore-link">Explorar &rarr;</a>
            </div>
        </div>
    </div>
</section>

<!-- Testimonials Section -->
<section class="testimonials-section" id="nosotros">
    <div class="container testimonial-container">
        <h2 class="section-title">Experiencias que hablan por nosotros</h2>
        
        <div class="testimonials-slider" id="testimonials-slider">
            <!-- Dynamically populated via JS and seeded from DB -->
        </div>
        
        <div class="slider-dots" id="slider-dots">
            <!-- Dot indicators added via JS -->
        </div>
    </div>
</section>

<!-- FAQ & Contact Form Section -->
<section class="faq-form-section" id="contacto">
    <div class="container faq-form-grid">
        <!-- FAQ Accordion -->
        <div class="faq-container">
            <h2>Preguntas frecuentes</h2>
            <div class="faq-list" id="faq-accordion-list">
                <!-- Dynamically loaded from database -->
            </div>
            <div class="faq-footer">
                ¿No encuentras la respuesta? 🐾 <a href="#" id="faq-ask-booz">Pregúntale a Booz</a>
            </div>
        </div>

        <!-- Contact Forms -->
        <div class="form-box">
            <h2>Estamos para escucharte</h2>
            <p>Selecciona el tipo de comunicación que deseas realizar para atenderte de la mejor manera.</p>
            
            <div class="form-tabs">
                <button class="form-tab-btn active" data-tab="consulta">Consultas</button>
                <button class="form-tab-btn" data-tab="reportar">Reportar</button>
                <button class="form-tab-btn" data-tab="contacto">Contacto</button>
            </div>

            <!-- Consultas Form -->
            <div class="form-content active" id="form-consulta">
                <form class="contact-form" onsubmit="submitForm(event, 'consulta')">
                    <div class="form-group">
                        <label for="c_name">Nombre completo</label>
                        <input type="text" id="c_name" required placeholder="Ej. Juan Pérez">
                    </div>
                    <div class="form-group">
                        <label for="c_email">Correo electrónico</label>
                        <input type="email" id="c_email" required placeholder="juan@ejemplo.com">
                    </div>
                    <div class="form-group">
                        <label for="c_message">Detalle de tu consulta médica o técnica</label>
                        <textarea id="c_message" rows="4" required placeholder="Escribe aquí tu consulta..."></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Enviar consulta &rarr;</button>
                </form>
            </div>

            <!-- Reportar Form -->
            <div class="form-content" id="form-reportar">
                <form class="contact-form" onsubmit="submitForm(event, 'reportar')">
                    <div class="form-group">
                        <label for="r_name">Nombre del notificador</label>
                        <input type="text" id="r_name" required placeholder="Ej. Dr. Carlos Gómez o Paciente">
                    </div>
                    <div class="form-group">
                        <label for="r_email">Correo de contacto</label>
                        <input type="email" id="r_email" required placeholder="carlos@ejemplo.com">
                    </div>
                    <div class="form-group">
                        <label for="r_phone">Teléfono de contacto</label>
                        <input type="tel" id="r_phone" required placeholder="+56 9 1234 5678">
                    </div>
                    <div class="form-group">
                        <label for="r_message">Descripción del evento adverso o reporte de farmacovigilancia</label>
                        <textarea id="r_message" rows="4" required placeholder="Detalla el lote del producto, síntomas o situación observada..."></textarea>
                    </div>
                    <button type="submit" class="btn btn-secondary">Enviar reporte &rarr;</button>
                </form>
            </div>

            <!-- Contacto Form -->
            <div class="form-content" id="form-contacto">
                <form class="contact-form" onsubmit="submitForm(event, 'contacto')">
                    <div class="form-group">
                        <label for="co_name">Nombre o Institución</label>
                        <input type="text" id="co_name" required placeholder="Ej. Farmacias Cruz o Nombre">
                    </div>
                    <div class="form-group">
                        <label for="co_email">Correo comercial/contacto</label>
                        <input type="email" id="co_email" required placeholder="contacto@empresa.com">
                    </div>
                    <div class="form-group">
                        <label for="co_message">Mensaje comercial o propuesta de alianza</label>
                        <textarea id="co_message" rows="4" required placeholder="Cuéntanos el motivo de tu contacto..."></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Enviar mensaje &rarr;</button>
                </form>
            </div>
        </div>
    </div>
</section>

<?php include 'includes/footer.php'; ?>
