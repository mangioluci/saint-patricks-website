// WhatsApp Integration for Chácara Saint Patrick

// Configuração WhatsApp
const whatsappConfig = {
    number: '5511914479990', // Substitua pelo número real da chácara
    defaultMessage: 'Olá! Gostaria de saber mais sobre a locação da Chácara Saint Patrick.'
};

// Função para gerar link WhatsApp
function generateWhatsAppLink(customMessage = '') {
    const message = customMessage || whatsappConfig.defaultMessage;
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${whatsappConfig.number}?text=${encodedMessage}`;
}

// Configurar todos os botões WhatsApp quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    
    // Configurar botão flutuante
    const floatButton = document.getElementById('whatsapp-link');
    if (floatButton) {
        floatButton.href = generateWhatsAppLink();
        floatButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.open(generateWhatsAppLink(), '_blank');
        });
    }
    
    // Configurar todos os botões com classe btn-whatsapp
    const ctaButtons = document.querySelectorAll('.btn-whatsapp');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Verificar se tem mensagem customizada
            const customMsg = this.dataset.message || whatsappConfig.defaultMessage;
            
            // Abrir WhatsApp em nova aba
            window.open(generateWhatsAppLink(customMsg), '_blank');
            
            // Analytics (opcional)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'whatsapp_click', {
                    'event_category': 'engagement',
                    'event_label': this.id || 'whatsapp_button'
                });
            }
        });
    });
    
    // Configurar botões específicos de serviços
    const serviceButtons = document.querySelectorAll('.service-whatsapp');
    serviceButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const service = this.dataset.service;
            const message = `Olá! Gostaria de saber mais sobre ${service} na Chácara Saint Patrick.`;
            
            window.open(generateWhatsAppLink(message), '_blank');
            
            // Analytics para serviços específicos
            if (typeof gtag !== 'undefined') {
                gtag('event', 'service_inquiry', {
                    'event_category': 'engagement',
                    'event_label': service
                });
            }
        });
    });
    
    // Configurar botão de navegação
    const navWhatsApp = document.getElementById('nav-whatsapp');
    if (navWhatsApp) {
        navWhatsApp.addEventListener('click', function(e) {
            e.preventDefault();
            const message = 'Olá! Vim pelo site e gostaria de fazer uma reserva na Chácara Saint Patrick.';
            window.open(generateWhatsAppLink(message), '_blank');
        });
    }
    
    // Configurar botão do hero
    const heroWhatsApp = document.getElementById('hero-whatsapp');
    if (heroWhatsApp) {
        heroWhatsApp.addEventListener('click', function(e) {
            e.preventDefault();
            const message = 'Olá! Vi o site da Chácara Saint Patrick e gostaria de fazer uma reserva!';
            window.open(generateWhatsAppLink(message), '_blank');
        });
    }
});

// Função para atualizar número do WhatsApp (caso necessário)
function updateWhatsAppNumber(newNumber) {
    whatsappConfig.number = newNumber;
    
    // Reconfigurar todos os botões
    const allButtons = document.querySelectorAll('.btn-whatsapp, .service-whatsapp, #whatsapp-link');
    allButtons.forEach(button => {
        if (button.tagName === 'A') {
            button.href = generateWhatsAppLink();
        }
    });
}

// Função para tracking de cliques (opcional)
function trackWhatsAppClick(buttonId, service = '') {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'whatsapp_click', {
            'event_category': 'conversion',
            'event_label': buttonId,
            'custom_parameter_1': service
        });
    }
    
    // Também pode usar Facebook Pixel se necessário
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Contact', {
            content_name: 'WhatsApp Click',
            content_category: service || 'general'
        });
    }
}

// Mostrar/esconder botão flutuante baseado no scroll
window.addEventListener('scroll', function() {
    const floatButton = document.querySelector('.whatsapp-float');
    const scrollPosition = window.pageYOffset;
    
    if (scrollPosition > 300) {
        floatButton.style.opacity = '1';
        floatButton.style.visibility = 'visible';
    } else {
        floatButton.style.opacity = '0.7';
    }
});

// Adicionar efeito de hover no botão flutuante
document.addEventListener('DOMContentLoaded', function() {
    const floatButton = document.querySelector('.whatsapp-float a');
    if (floatButton) {
        floatButton.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });
        
        floatButton.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }
});
