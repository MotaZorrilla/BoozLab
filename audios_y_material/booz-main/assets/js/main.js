// assets/js/main.js

document.addEventListener('DOMContentLoaded', () => {
    // Initialize components
    initUIControls();
    initNeedFinder();
    initFaqs();
    initTestimonials();
    initCart();
    initChatbot();
    initStore();
});

/* ==========================================
   UI Controls (Drawers & Modals)
   ========================================== */
function initUIControls() {
    const backdrop = document.getElementById('panel-backdrop');
    const cartPanel = document.getElementById('cart-panel');
    const chatbotPanel = document.getElementById('chatbot-panel');
    const storeModal = document.getElementById('store-modal');

    // Close buttons
    const closeBtns = document.querySelectorAll('.panel-close');
    
    // Open chat buttons
    const openChatBtns = [
        document.getElementById('btn-open-chat'),
        document.getElementById('floating-chat-bubble'),
        document.getElementById('btn-promo-chat'),
        document.getElementById('faq-ask-booz')
    ];

    // Open store button
    const openStoreBtn = document.getElementById('btn-open-store');

    // Setup Event Listeners
    openChatBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                openChat();
            });
        }
    });

    if (openStoreBtn) {
        openStoreBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openStore('all');
        });
    }

    closeBtns.forEach(btn => {
        btn.addEventListener('click', closeAllPanels);
    });

    if (backdrop) {
        backdrop.addEventListener('click', closeAllPanels);
    }

    // Document shortcuts
    document.querySelectorAll('.store-filter-shortcut').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const filter = link.getAttribute('data-filter');
            openStore(filter);
        });
    });
}

function openChat() {
    closeAllPanels();
    document.getElementById('panel-backdrop').classList.add('active');
    document.getElementById('chatbot-panel').classList.add('active');
    setTimeout(() => {
        document.getElementById('chat-user-input').focus();
    }, 300);
}

function closeChat() {
    document.getElementById('chatbot-panel').classList.remove('active');
    document.getElementById('panel-backdrop').classList.remove('active');
}

function openCart() {
    closeAllPanels();
    document.getElementById('panel-backdrop').classList.add('active');
    document.getElementById('cart-panel').classList.add('active');
    renderCart();
}

function closeCart() {
    document.getElementById('cart-panel').classList.remove('active');
    document.getElementById('panel-backdrop').classList.remove('active');
}

function openStore(lineId = 'all') {
    closeAllPanels();
    const modal = document.getElementById('store-modal');
    modal.style.display = 'flex';
    
    // Select filter in sidebar
    document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.getAttribute('data-filter') === lineId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    loadCatalogProducts(lineId);
}

function closeStore() {
    document.getElementById('store-modal').style.display = 'none';
}

function closeAllPanels() {
    const backdrop = document.getElementById('panel-backdrop');
    if (backdrop) backdrop.classList.remove('active');
    
    const cartPanel = document.getElementById('cart-panel');
    if (cartPanel) cartPanel.classList.remove('active');
    
    const chatbotPanel = document.getElementById('chatbot-panel');
    if (chatbotPanel) chatbotPanel.classList.remove('active');
    
    closeStore();
}

/* ==========================================
   Need Finder Tab Selector
   ========================================== */
function initNeedFinder() {
    const needItems = document.querySelectorAll('.need-item');
    const detailsPanel = document.getElementById('need-details-panel');

    const needContents = {
        cuidado: {
            title: 'Cuidado diario de la piel',
            text: 'Encuentra el producto ideal según tu necesidad. Ofrecemos fórmulas hidratantes, nutritivas y restauradoras para mantener la barrera cutánea sana y elástica todos los días.'
        },
        proteccion: {
            title: 'Protección barrera avanzada',
            text: 'Descubre tratamientos especializados que forman una película protectora frente a agresiones ambientales y patógenos externos. Ideal para pieles sensibles o expuestas.'
        },
        tratamiento: {
            title: 'Tratamiento clínico focalizado',
            text: 'Fórmulas con ingredientes activos potentes diseñados para combatir dermatitis, eccemas, picazón, infecciones bacterianas y procesos inflamatorios cutáneos localizados.'
        },
        bienestar: {
            title: 'Salud y bienestar integral',
            text: 'Nutre tu cuerpo y tu piel desde el interior. Suplementos alimenticios que aportan zinc y complejos vitamínicos para optimizar el metabolismo epidérmico y general.'
        },
        informacion: {
            title: 'Información y soporte técnico',
            text: 'Accede a nuestras guías científicas, hojas de seguridad y fichas técnicas. Si eres profesional médico, puedes solicitar muestras o información clínica específica.'
        }
    };

    needItems.forEach(item => {
        item.addEventListener('click', () => {
            needItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            const key = item.getAttribute('data-need');
            const content = needContents[key];

            if (content && detailsPanel) {
                detailsPanel.style.opacity = 0;
                detailsPanel.style.transform = 'translateY(5px)';
                
                setTimeout(() => {
                    detailsPanel.innerHTML = `<h4>${content.title}</h4><p>${content.text}</p>`;
                    detailsPanel.style.opacity = 1;
                    detailsPanel.style.transform = 'translateY(0)';
                }, 200);
            }
        });
    });
}

/* ==========================================
   FAQs Accordion
   ========================================== */
function initFaqs() {
    const accordionContainer = document.getElementById('faq-accordion-list');
    if (!accordionContainer) return;

    // Fetch FAQs from API
    fetch('api/api.php?action=get_faqs')
        .then(res => res.json())
        .then(res => {
            if (res.status === 'success' && res.data.length > 0) {
                accordionContainer.innerHTML = '';
                res.data.forEach((faq, index) => {
                    const item = document.createElement('div');
                    item.className = 'faq-item';
                    
                    item.innerHTML = `
                        <div class="faq-question">
                            <span>${faq.question}</span>
                            <span class="faq-icon">+</span>
                        </div>
                        <div class="faq-answer">
                            <p>${faq.answer}</p>
                        </div>
                    `;
                    accordionContainer.appendChild(item);

                    // Add click event
                    const question = item.querySelector('.faq-question');
                    question.addEventListener('click', () => {
                        const isActive = item.classList.contains('active');
                        
                        // Close all FAQ items
                        document.querySelectorAll('.faq-item').forEach(i => {
                            i.classList.remove('active');
                            i.querySelector('.faq-answer').style.maxHeight = null;
                        });

                        if (!isActive) {
                            item.classList.add('active');
                            const answer = item.querySelector('.faq-answer');
                            answer.style.maxHeight = answer.scrollHeight + "px";
                        }
                    });
                });
            }
        })
        .catch(err => console.error('Error fetching FAQs:', err));
}

/* ==========================================
   Testimonials Slider
   ========================================== */
function initTestimonials() {
    const slider = document.getElementById('testimonials-slider');
    const dotsContainer = document.getElementById('slider-dots');
    if (!slider) return;

    fetch('api/api.php?action=get_testimonials')
        .then(res => res.json())
        .then(res => {
            if (res.status === 'success' && res.data.length > 0) {
                slider.innerHTML = '';
                dotsContainer.innerHTML = '';

                res.data.forEach((t, index) => {
                    // Create Slide
                    const slide = document.createElement('div');
                    slide.className = `testimonial-slide ${index === 0 ? 'active' : ''}`;
                    slide.setAttribute('data-index', index);
                    slide.innerHTML = `
                        <div class="testimonial-card">
                            <div class="quote-icon">“</div>
                            <p>${t.quote}</p>
                            <div class="testimonial-author">
                                <img src="${t.avatar_path}" alt="${t.author_name}">
                                <div class="author-info">
                                    <h4>${t.author_name}</h4>
                                    <span>${t.author_role}</span>
                                </div>
                            </div>
                        </div>
                    `;
                    slider.appendChild(slide);

                    // Create Dot
                    const dot = document.createElement('div');
                    dot.className = `dot ${index === 0 ? 'active' : ''}`;
                    dot.setAttribute('data-index', index);
                    dot.addEventListener('click', () => showSlide(index));
                    dotsContainer.appendChild(dot);
                });

                // Auto slide logic
                let currentSlide = 0;
                setInterval(() => {
                    currentSlide = (currentSlide + 1) % res.data.length;
                    showSlide(currentSlide);
                }, 5000);
            }
        })
        .catch(err => console.error('Error fetching testimonials:', err));
}

function showSlide(index) {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    if (slides.length === 0) return;

    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    const activeSlide = document.querySelector(`.testimonial-slide[data-index="${index}"]`);
    const activeDot = document.querySelector(`.dot[data-index="${index}"]`);
    
    if (activeSlide) activeSlide.classList.add('active');
    if (activeDot) activeDot.classList.add('active');
}

/* ==========================================
   Store Catalog Modal
   ========================================== */
let allProducts = [];

function initStore() {
    const closeStoreBtn = document.getElementById('btn-close-store');
    if (closeStoreBtn) {
        closeStoreBtn.addEventListener('click', closeStore);
    }

    // Sidebar filter buttons click
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            loadCatalogProducts(filter);
        });
    });
}

function loadCatalogProducts(lineId) {
    const container = document.getElementById('catalog-products-container');
    if (!container) return;

    container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--primary); padding: 40px;">Cargando catálogo...</div>';

    fetch(`api/api.php?action=get_products&line_id=${lineId}`)
        .then(res => res.json())
        .then(res => {
            if (res.status === 'success') {
                allProducts = res.data;
                container.innerHTML = '';

                if (allProducts.length === 0) {
                    container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px;">No hay productos disponibles en esta línea.</div>';
                    return;
                }

                allProducts.forEach(prod => {
                    const card = document.createElement('div');
                    card.className = 'product-card';
                    card.innerHTML = `
                        <div>
                            <div class="prod-card-img">
                                <img src="${prod.image_path}" alt="${prod.name}">
                            </div>
                            <span class="line-tag">${prod.line_name}</span>
                            <h3>${prod.name}</h3>
                            <p>${prod.description}</p>
                            <p style="font-size: 0.75rem; color: var(--primary); font-weight: 600;">
                                Activo: ${prod.active_ingredients}
                            </p>
                        </div>
                        <div class="price-row" style="margin-top: 16px;">
                            <div>
                                <span class="price">$${prod.price}</span>
                                <span style="display:block; font-size: 0.7rem; color: ${prod.stock > 0 ? '#16A34A' : '#DC2626'}">
                                    ${prod.stock > 0 ? `Stock: ${prod.stock} disp.` : 'Agotado'}
                                </span>
                            </div>
                            ${prod.stock > 0 ? `
                                <button class="btn-add-cart" onclick="addToCart(${prod.id})" title="Añadir al carrito">
                                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                                    </svg>
                                </button>
                            ` : ''}
                        </div>
                    `;
                    container.appendChild(card);
                });
            }
        })
        .catch(err => {
            console.error('Error loading products:', err);
            container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #EF4444; padding: 40px;">Error al conectar con el servidor.</div>';
        });
}

/* ==========================================
   Shopping Cart Logic
   ========================================== */
let cart = [];

function initCart() {
    const closeCartBtn = document.getElementById('btn-close-cart');
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', closeCart);
    }

    // Load cart from localStorage
    const savedCart = localStorage.getItem('booz_cart');
    if (savedCart) {
        try {
            cart = jsonDecodeSafe(savedCart) || [];
        } catch(e) {
            cart = [];
        }
    }
}

function jsonDecodeSafe(str) {
    try { return JSON.parse(str); } catch(e) { return []; }
}

function saveCart() {
    localStorage.setItem('booz_cart', JSON.stringify(cart));
}

function addToCart(productId) {
    // Find product in catalog cache
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;

    // Check if already in cart
    const existing = cart.find(item => item.id === productId);
    
    if (existing) {
        if (existing.qty < product.stock) {
            existing.qty++;
        } else {
            alert('Límite de stock alcanzado para este producto.');
            return;
        }
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: parseFloat(product.price),
            image_path: product.image_path,
            line_name: product.line_name,
            qty: 1,
            max_stock: product.stock
        });
    }

    saveCart();
    
    // Visual feedback button animation or open cart drawer
    openCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCart();
}

function updateCartQty(productId, delta) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    item.qty += delta;

    if (item.qty <= 0) {
        removeFromCart(productId);
        return;
    }

    if (item.qty > item.max_stock) {
        alert('Límite de stock alcanzado.');
        item.qty = item.max_stock;
    }

    saveCart();
    renderCart();
}

function renderCart() {
    const container = document.getElementById('cart-items-container');
    const footerActions = document.getElementById('cart-footer-actions');
    const totalVal = document.getElementById('cart-total-value');
    const checkoutContainer = document.getElementById('checkout-form-container');

    // Reset checkout form view
    if (checkoutContainer) checkoutContainer.classList.remove('active');
    
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; color: var(--text-muted); margin-top: 40px;">
                <p>Tu carrito está vacío.</p>
                <button class="btn btn-light" onclick="closeCart(); openStore('all');" style="margin-top: 16px;">Ver catálogo</button>
            </div>
        `;
        if (footerActions) footerActions.style.display = 'none';
        return;
    }

    container.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.qty;
        total += itemTotal;

        const row = document.createElement('div');
        row.className = 'cart-item';
        row.innerHTML = `
            <img src="${item.image_path}" class="cart-item-img" alt="${item.name}">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>${item.line_name}</p>
                <div class="cart-item-qty">
                    <button class="qty-btn" onclick="updateCartQty(${item.id}, -1)">&minus;</button>
                    <span class="qty-val">${item.qty}</span>
                    <button class="qty-btn" onclick="updateCartQty(${item.id}, 1)">&plus;</button>
                </div>
            </div>
            <div style="text-align: right;">
                <div class="cart-item-price">$${itemTotal.toFixed(2)}</div>
                <span class="cart-item-remove" onclick="removeFromCart(${item.id})">Eliminar</span>
            </div>
        `;
        container.appendChild(row);
    });

    if (totalVal) totalVal.innerText = `$${total.toFixed(2)}`;
    if (footerActions) footerActions.style.display = 'block';
}

function showCheckoutForm() {
    document.getElementById('checkout-form-container').classList.add('active');
    document.getElementById('btn-goto-checkout').style.display = 'none';
    
    // Scroll checkout into view in cart body
    const cartBody = document.querySelector('.cart-body');
    setTimeout(() => {
        cartBody.scrollTo({
            top: cartBody.scrollHeight,
            behavior: 'smooth'
        });
    }, 200);
}

function submitCheckout(e) {
    e.preventDefault();

    const name = document.getElementById('ch_name').value.trim();
    const email = document.getElementById('ch_email').value.trim();
    const phone = document.getElementById('ch_phone').value.trim();
    const address = document.getElementById('ch_address').value.trim();

    if (!name || !email || !phone || !address) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    const payload = {
        action: 'submit_order',
        name: name,
        email: email,
        phone: phone,
        address: address,
        items: cart.map(item => ({ id: item.id, qty: item.qty }))
    };

    fetch('api/api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(res => {
        if (res.status === 'success') {
            alert(res.message);
            // Clear cart
            cart = [];
            saveCart();
            closeCart();
            // Reset checkout button
            document.getElementById('btn-goto-checkout').style.display = 'block';
            document.getElementById('cart-checkout-form').reset();
        } else {
            alert('Error: ' + res.message);
        }
    })
    .catch(err => {
        console.error('Error submitting order:', err);
        alert('Error de conexión al procesar el despacho.');
    });
}

/* ==========================================
   Chatbot Panel Logic
   ========================================== */
function initChatbot() {
    const closeChatBtn = document.getElementById('btn-close-chat');
    if (closeChatBtn) {
        closeChatBtn.addEventListener('click', closeChat);
    }
}

function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

function sendChatMessage() {
    const input = document.getElementById('chat-user-input');
    const container = document.getElementById('chat-messages-container');
    if (!input || !container) return;

    const text = input.value.trim();
    if (text === '') return;

    // Append User message
    appendChatMessage('user', text);
    input.value = '';

    // Typing loading indicator placeholder
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'chat-message message-bot typing-indicator';
    typingIndicator.innerHTML = 'Booz está escribiendo... 🐾';
    container.appendChild(typingIndicator);
    container.scrollTop = container.scrollHeight;

    // Send query to API
    fetch('api/api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            action: 'chatbot_query',
            message: text
        })
    })
    .then(res => res.json())
    .then(res => {
        // Remove typing indicator
        typingIndicator.remove();

        if (res.status === 'success') {
            appendChatMessage('bot', res.reply);
        } else {
            appendChatMessage('bot', 'Perdón, estoy teniendo problemas de comunicación con el laboratorio central. Inténtalo de nuevo.');
        }
    })
    .catch(err => {
        console.error('Chat error:', err);
        typingIndicator.remove();
        appendChatMessage('bot', 'Guau... Ha ocurrido un error de conexión.');
    });
}

function appendChatMessage(sender, text) {
    const container = document.getElementById('chat-messages-container');
    if (!container) return;

    const bubble = document.createElement('div');
    bubble.className = `chat-message ${sender === 'user' ? 'message-user' : 'message-bot'}`;

    if (sender === 'bot') {
        bubble.innerHTML = `
            <div class="chat-bot-identity">
                <img src="assets/img/booz_mascot.png" alt="Booz Logo">
                Booz
            </div>
            ${text}
        `;
    } else {
        bubble.innerText = text;
    }

    container.appendChild(bubble);
    container.scrollTop = container.scrollHeight;
}

/* ==========================================
   Form Submissions (Consultas, Reportar, Contacto)
   ========================================== */
// Switch form tabs
const tabButtons = document.querySelectorAll('.form-tab-btn');
const formContents = document.querySelectorAll('.form-content');

tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        formContents.forEach(c => c.classList.remove('active'));

        btn.classList.add('active');
        const tabId = 'form-' + btn.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
    });
});

function submitForm(e, type) {
    e.preventDefault();

    let name, email, phone = null, message;

    if (type === 'consulta') {
        name = document.getElementById('c_name').value.trim();
        email = document.getElementById('c_email').value.trim();
        message = document.getElementById('c_message').value.trim();
    } else if (type === 'reportar') {
        name = document.getElementById('r_name').value.trim();
        email = document.getElementById('r_email').value.trim();
        phone = document.getElementById('r_phone').value.trim();
        message = document.getElementById('r_message').value.trim();
    } else if (type === 'contacto') {
        name = document.getElementById('co_name').value.trim();
        email = document.getElementById('co_email').value.trim();
        message = document.getElementById('co_message').value.trim();
    }

    const payload = {
        action: 'submit_form',
        type: type,
        name: name,
        email: email,
        phone: phone,
        message: message
    };

    fetch('api/api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(res => {
        if (res.status === 'success') {
            alert(res.message);
            // Reset active form
            e.target.reset();
        } else {
            alert('Error: ' + res.message);
        }
    })
    .catch(err => {
        console.error('Error submitting form:', err);
        alert('Hubo un error al procesar tu solicitud. Revisa tu conexión.');
    });
}
