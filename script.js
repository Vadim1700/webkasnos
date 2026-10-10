/* --- ОБНОВЛЕНИЕ ВРЕМЕНИ (Главная, Оплата, Тарифы) --- */
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('ru-RU', { hour12: false });
    
    // Обновляем время на главной странице
    const mainTime = document.getElementById('current-time');
    if (mainTime) { mainTime.textContent = timeString; }
    
    // Обновляем время в окне выбора оплаты
    const paymentTime = document.getElementById('payment-current-time');
    if (paymentTime) { paymentTime.textContent = timeString; }

    // Обновляем время в окне выбора тарифа
    const tariffTime = document.getElementById('tariff-current-time');
    if (tariffTime) { tariffTime.textContent = timeString; }
}

// Запускаем обновление каждую секунду
setInterval(updateTime, 1000);
// Вызываем сразу при загрузке, чтобы не было задержки
updateTime();

/* --- ПЕРЕМЕННЫЕ --- */
let currentUserID = null;
let selectedTariffType = null; // Хранит выбранный тариф (7days, 14days, forever)

/* --- ГЕНЕРАЦИЯ ID --- */
function generateUserID() {
    if (!currentUserID) {
        currentUserID = Math.floor(Date.now() / 1000).toString(36) + Math.random().toString(36).substr(2, 5).toUpperCase();
    }
    return currentUserID;
}

/* --- ФУНКЦИИ УПРАВЛЕНИЯ МОДАЛЬНЫМИ ОКНАМИ --- */
function openModal(modalId) { 
    document.getElementById(modalId).style.display = 'flex'; 
}
function closeModal(modalId) { 
    document.getElementById(modalId).style.display = 'none'; 
}

/* --- УВЕДОМЛЕНИЕ (Красная плашка) --- */
function showNotification() {
    const bar = document.getElementById('notification-bar');
    if (bar) { 
        bar.style.display = 'block'; 
        setTimeout(() => bar.style.display = 'none', 15000); // Висит 15 секунд
    }
}

/* --- ОТКРЫТИЕ ОКНА "НЕТ ПОДПИСКИ" --- */
function openAccessModal(moduleName) {
    document.getElementById('modal-module-title').textContent = `МОДУЛЬ "${moduleName}"`;
    openModal('accessModal');
}

/* --- ВЫБОР ТАРИФА (подсветка) --- */
function selectTariff(element, type) {
    selectedTariffType = type; // Сохраняем выбор
    document.querySelectorAll('.pricing-option').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');
}

/* --- ГЛАВНАЯ ЛОГИКА СТРАНИЦЫ --- */
document.addEventListener('DOMContentLoaded', function() {
    
    /* 1. Заполняем ID в окне оплаты картой */
    document.getElementById('user-id-display').textContent = generateUserID();

    /* 2. Кнопки модулей на странице "Функции" */
    document.querySelectorAll('.module-btn').forEach(btn => {
        btn.addEventListener('click', function() { 
            openAccessModal(this.dataset.module); 
        });
    });

    /* 3. Окно: "Отсутствует подписка" */
    document.getElementById('btn-buy-access').addEventListener('click', () => { 
        closeModal('accessModal'); 
        openModal('tariffModal'); 
    });
    document.getElementById('btn-later').addEventListener('click', () => closeModal('accessModal'));

    /* 4. Окно: "Выбор тарифа" */
    document.getElementById('btn-confirm-tariff').addEventListener('click', () => {
        if (selectedTariffType) {
            openModal('paymentMethodModal');
        } else {
            alert('Пожалуйста, выберите период подписки');
        }
    });
    document.getElementById('btn-back-from-tariff').addEventListener('click', () => { 
        closeModal('tariffModal'); 
        openModal('accessModal'); 
    });

    /* 5. Окно: "Выбор оплаты" */
    document.getElementById('btn-pay-card').addEventListener('click', () => { 
        closeModal('paymentMethodModal'); 
        openModal('paymentCardModal'); 
        setTimeout(showNotification, 300000); 
    });
    
    document.getElementById('btn-pay-crypto').addEventListener('click', () => { 
        const links = { 
            '7days': 'https://t.me/+LJyQydrWUFMwMjhi', 
            '14days': 'https://t.me/+bnd60MDoATY1MjBi', 
            'forever': 'https://t.me/+ZaqMPcnhSlQxNDVi' 
        };
        // Проверяем, выбран ли тариф, и открываем ссылку
        if (selectedTariffType && links[selectedTariffType]) {
            window.open(links[selectedTariffType], '_blank'); 
        } else {
            alert('Сначала выберите тариф');
        }
    });

    document.getElementById('btn-back-from-payment').addEventListener('click', () => { 
        closeModal('paymentMethodModal'); 
        openModal('tariffModal'); 
    });

    /* 6. Окно: "Оплата картой" */
    document.getElementById('btn-back-from-card').addEventListener('click', () => { 
        closeModal('paymentCardModal'); 
        openModal('paymentMethodModal'); 
    });
    document.getElementById('btn-check-payment').addEventListener('click', showNotification);

    /* 7. Универсальное закрытие окон на крестик */
    document.querySelectorAll('.modal-close').forEach(b => {
        b.addEventListener('click', () => {
            b.closest('.modal-overlay').style.display = 'none'; 
        });
    });

    /* 8. Закрытие по клику на фон (оверлей) */
    document.getElementById('tariffModal').addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            selectedTariffType = null;
            document.querySelectorAll('.pricing-option').forEach(el => el.classList.remove('selected'));
            closeModal('tariffModal');
        }
    });
    document.getElementById('paymentMethodModal').addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            closeModal('paymentMethodModal');
        }
    });
    document.getElementById('paymentCardModal').addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            closeModal('paymentCardModal');
            openModal('paymentMethodModal');
        }
    });
});