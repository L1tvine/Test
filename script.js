$(document).ready(function () {
    const itemRarities = [
        { name: "Common", image: "image1.png", color: "#0000CD", chance: 50, cost: 20 },
        { name: "Uncommon", image: "image2.png", color: "#0000CD", chance: 20, cost: 30 },
        { name: "Rare", image: "image3.png", color: "#9400D3", chance: 5, cost: 50 },
        { name: "Epic", image: "image4.png", color: "#9400D3", chance: 5, cost: 100 },
        { name: "Legendary", image: "image5.png", color: "#FF1493", chance: 1, cost: 200 },
        { name: "Mythical", image: "image7.png", color: "#FF4500", chance: 0.5, cost: 500 },
        { name: "Godlike", image: "image8.png", color: "#FFD700", chance: 0.1, cost: 1000 },
    ];

    const profileBalance = $("#profile-balance");
    const profileInventory = $("#profile-inventory");
    const balanceAmount = $("#balance-amount");
    const openCaseBtn = $("#open-case-btn");
    const sellAllBtn = $("#sell-all-btn");
    const resultDiv = $("#result");
    const itemImg = $("#item-img");
    const itemRarity = $("#item-rarity");
    const itemCost = $("#item-cost");
    const inventoryItems = $("#inventory-items");
    const inventoryValue = $("#inventory-value");

    let balance = parseInt(localStorage.getItem('balance')) || 1000000;
    let totalInventoryValue = 0;

    function updateBalance() {
        balanceAmount.text(Math.max(0, balance));
        profileBalance.text(balance);
    }

    function deductCaseCost() {
        balance -= 70;
        updateBalance();
    }

    function creditItemCost(cost) {
        balance += cost;
        updateBalance();
    }

    function updateInventoryValue() {
        inventoryValue.text(Math.max(0, totalInventoryValue));
    }

    function getRandomItem() {
        const random = Math.random() * 100;
        let cumulativeChance = 0;

        for (const rarity of itemRarities) {
            cumulativeChance += rarity.chance;

            if (random <= cumulativeChance) {
                return rarity;
            }
        }

        return itemRarities[0];
    }

    function openCase() {
        if (balance >= 70) {
            deductCaseCost();

            const randomItem = getRandomItem();

            resultDiv.show();
            itemImg.attr("src", randomItem.image);
            itemImg.attr("alt", randomItem.name);
            itemImg.css("borderColor", randomItem.color);

            itemRarity.text(`Rarity: ${randomItem.name}`);
            itemCost.text(`Cost: ${randomItem.cost} coins`);

            const inventoryItem = createInventoryItem(randomItem.name, randomItem.cost);
            inventoryItems.append(inventoryItem);

            totalInventoryValue += randomItem.cost;
            updateInventoryValue();

            saveDataToLocalStorage();
            displayProfileInventory(); // Обновление отображения предметов в профиле
        } else {
            alert("Insufficient balance. Please add more coins.");
        }
    }

    function createInventoryItem(name, cost) {
        const randomItem = itemRarities.find(rarity => rarity.name === name);
        const inventoryItem = $(`<div class="inventory-item" data-cost="${cost}"></div>`);
        inventoryItem.css("background-color", randomItem.color);

        const itemImage = $(`<img src="${randomItem.image}" alt="${name}">`);
        inventoryItem.append(itemImage);

        const itemInfo = $(`<div class="item-info">${name} - ${cost} coins</div>`);
        inventoryItem.append(itemInfo);

        const sellButton = $(`<button class='sell-item-in-inventory'>Sell (${cost} coins)</button>`);
        sellButton.click(function () {
            sellSingleItem(inventoryItem, cost);
        });

        inventoryItem.append($("<div class='sell-button-container'></div>").append(sellButton));

        return inventoryItem;
    }

    function sellSingleItem(item, cost) {
        creditItemCost(cost);

        item.remove();
        resultDiv.hide();
        itemImg.attr("src", "");
        itemImg.attr("alt", "");
        itemRarity.text("");
        itemCost.text("");

        totalInventoryValue -= cost;
        updateInventoryValue();

        saveDataToLocalStorage();
        displayProfileInventory(); // Обновление отображения предметов в профиле

        alert(`Sold item for ${cost} coins.`);
    }

    function sellAllItems() {
        $(".inventory-item").each(function () {
            const cost = parseInt($(this).attr("data-cost"));
            totalInventoryValue -= cost;
            creditItemCost(cost);
            $(this).remove();
        });

        updateInventoryValue();
        saveDataToLocalStorage();
        displayProfileInventory(); // Обновление отображения предметов в профиле

        alert(`Sold all items for ${totalInventoryValue} coins.`);
    }

    function saveDataToLocalStorage() {
        localStorage.setItem('balance', balance);
        const inventoryData = [];

        $(".inventory-item").each(function () {
            const name = $(this).find(".item-info").text().split(" - ")[0];
            const cost = parseInt($(this).attr("data-cost"));
            inventoryData.push({ name, cost });
        });

        localStorage.setItem('inventory', JSON.stringify(inventoryData));
    }

    function loadInventoryFromLocalStorage() {
        const savedInventory = JSON.parse(localStorage.getItem('inventory')) || [];

        savedInventory.forEach(item => {
            const { name, cost } = item;
            const inventoryItem = createInventoryItem(name, cost);
            inventoryItems.append(inventoryItem);
            totalInventoryValue += cost;
        });

        updateInventoryValue();
    }

    openCaseBtn.click(openCase);
    sellAllBtn.click(function () {
        sellAllItems();
    });

    loadInventoryFromLocalStorage();
    updateBalance();

    // Сохранение данных при закрытии страницы
    window.addEventListener('beforeunload', function () {
        saveDataToLocalStorage();
    });

    // Функция для отображения предметов в профиле
    function displayProfileInventory() {
        const savedInventory = JSON.parse(localStorage.getItem('inventory')) || [];
        profileInventory.html(''); // Очищаем содержимое перед отображением нового инвентаря

        savedInventory.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.textContent = `${item.name} - ${item.cost} coins`;

            profileInventory.append(itemDiv);
        });
    }

    // Обновление отображения предметов в профиле
    displayProfileInventory();
});
