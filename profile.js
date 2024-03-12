// Проверяем наличие сохраненной аватарки, никнейма, баланса и инвентаря в localStorage
const savedAvatar = localStorage.getItem('avatar');
const savedNickname = localStorage.getItem('nickname');
const savedBalance = parseInt(localStorage.getItem('balance')) || 0;
const savedInventory = JSON.parse(localStorage.getItem('inventory')) || [];

// Устанавливаем сохраненные значения
document.getElementById('avatar').src = savedAvatar || 'default-avatar.jpg';
document.getElementById('nickname').value = savedNickname || '';
document.getElementById('profile-balance').textContent = savedBalance;

// Обновляем отображение никнейма
document.getElementById('displayed-nickname').textContent = savedNickname;

document.getElementById('avatar-input').addEventListener('change', function (event) {
    const input = event.target;
    const file = input.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const avatar = document.getElementById('avatar');
            avatar.src = e.target.result;

            // Сохраняем новую аватарку в localStorage
            localStorage.setItem('avatar', e.target.result);
        };

        reader.readAsDataURL(file);
    }
});

document.getElementById('change-avatar-btn').addEventListener('click', function () {
    // Сохраняем никнейм в localStorage
    const nickname = document.getElementById('nickname').value;
    localStorage.setItem('nickname', nickname);

    // Обновляем отображение никнейма
    document.getElementById('displayed-nickname').textContent = nickname;

    alert('Изменения сохранены!');
});

document.getElementById('return-to-main-menu-btn').addEventListener('click', function () {
    // Перенаправление на главное меню
    window.location.href = 'index.html';
});

// Функция для отображения инвентаря
function displayInventory(inventory) {
    const profileInventoryDiv = document.getElementById('profile-inventory');
    profileInventoryDiv.innerHTML = ''; // Очищаем содержимое перед отображением нового инвентаря

    inventory.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.textContent = `${item.name} - ${item.cost} coins`;

        profileInventoryDiv.appendChild(itemDiv);
    });
}

// Обновление отображения инвентаря
displayInventory(savedInventory);

