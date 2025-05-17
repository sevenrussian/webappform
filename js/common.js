// Общие функции для всех форм
function initForm(config) {
    // Управление слайдами
    const slides = document.querySelectorAll('.form-slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active', 'prev', 'next');
            if (i === index) {
                slide.classList.add('active');
            } else if (i < index) {
                slide.classList.add('prev');
            } else {
                slide.classList.add('next');
            }
        });
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        currentSlide = index;
    }
    
    // Навигация
    document.querySelector(config.slides[0].nextBtn).addEventListener('click', () => {
        const requiredFields = document.querySelectorAll(`#${config.slides[0].id} [required]`);
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = 'red';
                isValid = false;
            } else {
                field.style.borderColor = '#ddd';
            }
        });
        
        if (isValid) showSlide(1);
        else alert('Пожалуйста, заполните все обязательные поля');
    });
    
    if (config.slides[1].prevBtn) {
        document.querySelector(config.slides[1].prevBtn).addEventListener('click', () => showSlide(0));
    }
    
    // Клик по точкам прогресса
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const slideIndex = parseInt(dot.getAttribute('data-slide'));
            if (slideIndex === 0 || (slideIndex === 1 && currentSlide === 1)) {
                showSlide(slideIndex);
            }
        });
    });
    
    // Маска для телефона
    if (config.phoneField) {
        const phoneInput = document.getElementById(config.phoneField);
        if (phoneInput) {
            phoneInput.addEventListener('input', function(e) {
                let x = e.target.value.replace(/\D/g, '').match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
                e.target.value = !x[2] ? x[1] : '+' + x[1] + ' (' + x[2] + ') ' + x[3] + (x[4] ? '-' + x[4] : '') + (x[5] ? '-' + x[5] : '');
            });
        }
    }
    
    // Отправка формы
    const form = document.getElementById(config.formId);
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Проверка телефона
            if (config.phoneField) {
                const phoneInput = document.getElementById(config.phoneField);
                const phoneRegex = /^[\+]\d{1}\s[\(]\d{3}[\)]\s\d{3}[\-]\d{2}[\-]\d{2}$/;
                
                if (phoneInput && !phoneRegex.test(phoneInput.value)) {
                    alert('Пожалуйста, введите корректный номер телефона в формате +7 (XXX) XXX-XX-XX');
                    phoneInput.focus();
                    return;
                }
            }
            
            // Собираем данные формы
            const formData = {};
            document.querySelectorAll(`#${config.formId} [name]`).forEach(field => {
                formData[field.name] = field.value;
            });
            
            if (window.Telegram && Telegram.WebApp) {
                Telegram.WebApp.sendData(JSON.stringify(formData));
                Telegram.WebApp.close();
            } else {
                console.log('Form data:', formData);
                alert('Форма отправлена! (в демо-режиме)');
            }
        });
    }
}
