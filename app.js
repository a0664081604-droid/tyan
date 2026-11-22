
const tg = window.Telegram?.WebApp;

if (tg) {
    tg.ready();
    tg.expand();
}

let coins = 0;
let power = 1;
let level = 1;
let upgrades = 0;
let auto = 0;

function save() {
    localStorage.setItem("tyanSave", JSON.stringify({
        coins, power, level, upgrades, auto
    }));
}

function load() {
    const data = JSON.parse(
        localStorage.getItem("tyanSave") || "null"
    );

    if (data) {
        coins = data.coins || 0;
        power = data.power || 1;
        level = data.level || 1;
        upgrades = data.upgrades || 0;
        auto = data.auto || 0;
    }
}

function render() {
    document.getElementById("coins").textContent =
        Math.floor(coins);

    document.getElementById("power").textContent = power;
    document.getElementById("level").textContent = level;

    const price = Math.floor(50 * 1.65 ** upgrades);
    const autoPrice = Math.floor(150 * 1.8 ** auto);

    document.getElementById("price").textContent = price;
    document.getElementById("autoPrice").textContent = autoPrice;

    document.getElementById("buy").disabled = coins < price;
    document.getElementById("buyAuto").disabled = coins < autoPrice;
}

document.getElementById("clicker").onclick = () => {
    coins += power;

    if (coins >= level * 500) {
        level++;
    }

    tg?.HapticFeedback?.impactOccurred("light");

    save();
    render();
};

document.getElementById("buy").onclick = () => {
    const price = Math.floor(50 * 1.65 ** upgrades);

    if (coins >= price) {
        coins -= price;
        power++;
        upgrades++;

        save();
        render();
    }
};

document.getElementById("buyAuto").onclick = () => {
    const price = Math.floor(150 * 1.8 ** auto);

    if (coins >= price) {
        coins -= price;
        auto++;

        save();
        render();
    }
};

setInterval(() => {
    if (auto > 0) {
        coins += auto;
        save();
        render();
    }
}, 1000);

document.getElementById("bonus").onclick = () => {
    const today = new Date().toDateString();

    if (localStorage.getItem("tyanBonus") === today) {
        alert("Бонус уже получен!");
        return;
    }

    coins += 250;

    localStorage.setItem("tyanBonus", today);

    save();
    render();

    alert("Ты получил 250 монет! 🎁");
};

load();
render();
