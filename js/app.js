// ==========================================
// 1. SELEKTOR UTAMA
// ==========================================
const gameCards = document.querySelectorAll(".game-card");
const itemList = document.getElementById("itemList");
const menuBtn = document.querySelector(".menu-btn");
const drawer = document.getElementById("drawer");
const overlay = document.getElementById("overlay");
const closeBtn = document.getElementById("closeDrawer");

// ==========================================
// 2. LOGIKA SLIDER (INFINITE LOOP + MANUAL)
// ==========================================
const track = document.querySelector('.slides-track');
const allSlides = document.querySelectorAll(".slide");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const totalSlides = allSlides.length; 
let index = 0;
let isTransitioning = false; // Mencegah spam klik saat animasi jalan

// Fungsi Update Posisi Slider
function updateSlider() {
    track.style.transition = "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)";
    track.style.transform = `translateX(-${index * 100}%)`;
}

// Fungsi Slide Berikutnya (Next)
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
            isTransitioning = false;
        }, 700);
    }
}

// Fungsi Slide Sebelumnya (Prev)
function prevSlide() {
    if (isTransitioning) return;
    
    if (index === 0) {
        // Teleport ke klon terakhir tanpa animasi
        track.style.transition = "none";
        index = totalSlides - 1;
        track.style.transform = `translateX(-${index * 100}%)`;
        
        // Jeda sangat singkat lalu geser ke gambar asli terakhir dengan animasi
        setTimeout(() => {
            index--;
            updateSlider();
        }, 10);
    } else {
        index--;
        updateSlider();
    }
}

// Event Listener Tombol Slider
if (nextBtn) nextBtn.addEventListener("click", () => {
    nextSlide();
    resetAutoSlide();
});

if (prevBtn) prevBtn.addEventListener("click", () => {
    prevSlide();
    resetAutoSlide();
});

// Auto Slide Timer
let autoSlideInterval = setInterval(nextSlide, 4000);

function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(nextSlide, 4000);
}

// ==========================================
// 3. LOGIKA NAVIGASI (DRAWER)
// ==========================================
function openMenu() {
    drawer.classList.add("active");
    overlay.classList.add("active");
}

function closeMenu() {
    drawer.classList.remove("active");
    overlay.classList.remove("active");
}

// Tombol Hamburger (Toggle)
menuBtn.addEventListener("click", () => {
    if (drawer.classList.contains("active")) {
        closeMenu();
    } else {
        openMenu();
    }
});

// Tombol Silang & Overlay
if (closeBtn) closeBtn.addEventListener("click", closeMenu);
overlay.addEventListener("click", closeMenu);

// ==========================================
// 4. LOGIKA PILIH GAME & FETCH DATA
// ==========================================
gameCards.forEach(card => {
    card.addEventListener("click", async () => {
        // Efek Visual Aktif
        gameCards.forEach(c => c.classList.remove("active"));
        card.classList.add("active");

        const currentGame = card.dataset.game;

        // Tampilkan Loading
        itemList.innerHTML = `
            <div class="loading">
                <span class="loader"></span>
                Memuat Harga...
            </div>
        `;

        try {
            // Animasi loading buatan (600ms)
            await new Promise(res => setTimeout(res, 600));

            const res = await fetch(`data/${currentGame}.json`);
            if (!res.ok) throw new Error("Data tidak ditemukan");
            
            const data = await res.json();
            itemList.innerHTML = ""; 

            data.items.forEach(item => {
                const div = document.createElement("div");
                div.className = "item-card";
                div.innerHTML = `
                    <span class="item-name">${item.name}</span>
                    <span class="item-price">
                        Rp ${Number(item.price).toLocaleString("id-ID")}
                    </span>
                `;
                itemList.appendChild(div);
            });

        } catch (err) {
            itemList.innerHTML = `
                <div class="loading" style="color: #ff6b6b; flex-direction: column; gap: 5px;">
                    <span>Gagal memuat data.</span>
                    <small style="font-size: 10px; opacity: 0.7;">(Cek file data/${currentGame}.json)</small>
                </div>`;
        }
    });
});
