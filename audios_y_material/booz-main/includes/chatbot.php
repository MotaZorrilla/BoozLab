<?php
// includes/chatbot.php
?>
<div class="sidebar-panel" id="chatbot-panel">
    <div class="panel-header">
        <h3>
            <img src="assets/img/booz_mascot.png" alt="Mascota Booz" style="width: 30px; height: 30px; border-radius: 50%; background: #FFF; object-fit: cover;">
            Asistente Booz
        </h3>
        <button class="panel-close" id="btn-close-chat">&times;</button>
    </div>
    
    <div class="chat-body" id="chat-messages-container">
        <!-- Default Welcome Message -->
        <div class="chat-message message-bot">
            <div class="chat-bot-identity">
                <img src="assets/img/booz_mascot.png" alt="Booz Logo">
                Booz
            </div>
            ¡Hola! Soy Booz, tu asistente virtual de BOOZ Laboratorio. 🐾 <br><br>
            Estoy aquí para ayudarte a conocer nuestras 4 líneas de productos, indicarte para qué sirve cada medicamento (como <strong>Albemer</strong>, <strong>Dexamer</strong>, <strong>L-Fortex</strong> o <strong>Bactrocis</strong>) o resolver dudas sobre compras. ¿Qué te gustaría saber hoy?
        </div>
    </div>
    
    <div class="chat-footer">
        <div class="chat-input-wrapper">
            <input type="text" id="chat-user-input" placeholder="Escribe tu mensaje aquí..." onkeypress="handleChatKeyPress(event)">
        </div>
        <button class="chat-send-btn" id="btn-send-message" onclick="sendChatMessage()">
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
        </button>
    </div>
</div>
