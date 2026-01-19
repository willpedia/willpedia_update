// ==========================================
// 1. SELEKTOR UTAMA
// ==========================================
const gameCards = document.querySelectorAll(".game-card");
const itemList = document.getElementById("itemList");
const menuBtn = document.querySelector(".menu-btn");
const drawer = document.getElementById("drawer");
const overlay = document.getElementById("overlay");
const closeBtn = document.getElementById("closeDrawer");
const searchInput = document.getElementById("gameSearch");
const searchOverlay = document.getElementById("searchOverlay");
const searchResults = document.getElementById("searchResults");

// DAFTAR FILE DATA (Wajib update jika ada file .json baru)
const allDataFiles = [
    "genshin_impact.json",
    "honkai_star_rail.json",
    "mobile_legends.json",
    "valorant.json",
    "wuthering_waves.json",
    "zenless_zone_zero.json"
];

// ==========================================
// 2. LOGIKA SLIDER (INFINITE + DOTS + MANUAL)
// ==========================================
const track = document.querySelector('.slides-track');
const allSlides = document.querySelectorAll(".slide");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const dotsContainer = document.getElementById("sliderDots");

const totalSlides = allSlides.length; 
const realSlidesCount = totalSlides - 1; // Kecuali klon
let index = 0;
let isTransitioning = false;

// Buat Titik Indikator (Dots) secara otomatis
for (let i = 0; i < realSlidesCount; i++) {
    const dot = document.createElement("div");
    dot.classList.add("dot");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => {
        if (isTransitioning) return;
        index = i;
        updateSlider();
        resetAutoSlide();
    });
    dotsContainer.appendChild(dot);
}

function updateDots() {
    const dots = document.querySelectorAll(".dot");
    const activeIndex = index % realSlidesCount;
    dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === activeIndex);
    });
}

function updateSlider() {
    track.style.transition = "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)";
    track.style.transform = `translateX(-${index * 100}%)`;
    updateDots();
}

function nextSlide() {
    if (isTransitioning) return;
    index++;
    updateSlider();

    if (index === totalSlides - 1) {
        isTransitioning = true;
        setTimeout(() => {
            track.style.transition = "none";
            index = 0;
            track.style.transform = `translateX(0)`;
            updateDots();
            isTransitioning = false;
        }, 700);
    }
}

function prevSlide() {
    if (isTransitioning) return;
    if (index === 0) {
        track.style.transition = "none";
        index = totalSlides - 1;
        track.style.transform = `translateX(-${index * 100}%)`;
        setTimeout(() => {
            index--;
            updateSlider();
        }, 10);
    } else {
        index--;
        updateSlider();
    }
}

// Event Slider
if (nextBtn) nextBtn.addEventListener("click", () => { nextSlide(); resetAutoSlide(); });
if (prevBtn) prevBtn.addEventListener("click", () => { prevSlide(); resetAutoSlide(); });

let autoSlideInterval = setInterval(nextSlide, 4000);
function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(nextSlide, 4000);
}

// ==========================================
// 3. LOGIKA GLOBAL SEARCH (OVERLAY)
// ==========================================
async function globalSearch(query) {
    if (query.length < 2) {
        searchOverlay.classList.remove("active");
        return;
    }

    searchOverlay.classList.add("active");
    closeMenu();
    searchResults.innerHTML = `<div class="loading">Mencari item...</div>`;

    const fetchPromises = allDataFiles.map(async (file) => {
        try {
            const res = await fetch(`data/${file}`);
            const data = await res.json();
            const found = data.items.filter(item => 
                item.name.toLowerCase().includes(query.toLowerCase())
            );
            return found.map(item => ({
                ...item,
                gameSource: file.replace(".json", "").replace(/_/g, " ")
            }));
        } catch (e) { return []; }
    });

    const resultsArray = await Promise.all(fetchPromises);
    const matches = resultsArray.flat();

    renderSearchResults(matches);
}

function renderSearchResults(results) {
    searchResults.innerHTML = "";
    if (results.length === 0) {
        searchResults.innerHTML = `<div class="loading">Item tidak ditemukan.</div>`;
        return;
    }

    results.forEach(item => {
        const div = document.createElement("div");
        div.className = "search-item";
        div.innerHTML = `
            <div class="item-info">
                <span class="game-tag">${item.gameSource}</span>
                <span class="item-name">${item.name}</span>
            </div>
            <span class="item-price">Rp ${Number(item.price).toLocaleString("id-ID")}</span>
        `;
        div.onclick = () => {
            const waUrl = `https://wa.me/6281357706121?text=Halo WILLPEDIA, saya mau order ${item.name} (${item.gameSource})`;
            window.open(waUrl, '_blank');
        };
        searchResults.appendChild(div);
    });
}

if (searchInput) {
    searchInput.addEventListener("input", (e) => globalSearch(e.target.value));
    searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            globalSearch(e.target.value);
            searchInput.blur();
        }
    });
    searchInput.addEventListener("focus", () => {
        if (searchInput.value.length >= 2) searchOverlay.classList.add("active");
        closeMenu();
    });
}

// ==========================================
// 4. LOGIKA NAVIGASI (DRAWER)
// ==========================================
function openMenu() {
    drawer.classList.add("active");
    overlay.classList.add("active");
    searchOverlay.classList.remove("active");
}

function closeMenu() {
    drawer.classList.remove("active");
    overlay.classList.remove("active");
}

menuBtn.addEventListener("click", () => {
    drawer.classList.contains("active") ? closeMenu() : openMenu();
});

if (closeBtn) closeBtn.addEventListener("click", closeMenu);
overlay.addEventListener("click", () => {
    closeMenu();
    searchOverlay.classList.remove("active");
});

// ==========================================
// 5. LOGIKA PILIH GAME (GRID)
// ==========================================
gameCards.forEach(card => {
    card.addEventListener("click", async () => {
        searchOverlay.classList.remove("active");
        gameCards.forEach(c => c.classList.remove("active"));
        card.classList.add("active");

        const currentGame = card.dataset.game;
        itemList.innerHTML = `<div class="loading"><span class="loader"></span> Memuat Harga...</div>`;

        try {
            await new Promise(res => setTimeout(res, 500));
            const res = await fetch(`data/${currentGame}.json`);
            if (!res.ok) throw new Error();
            const data = await res.json();
            itemList.innerHTML = ""; 

            data.items.forEach(item => {
                const div = document.createElement("div");
                div.className = "item-card";
                div.innerHTML = `
                    <span class="item-name">${item.name}</span>
                    <span class="item-price">Rp ${Number(item.price).toLocaleString("id-ID")}</span>
                `;
                itemList.appendChild(div);
            });
        } catch (err) {
            itemList.innerHTML = `<div class="loading" style="color: #ff6b6b;">Data belum tersedia.</div>`;
        }
    });
});

