// SELEKTOR UTAMA
const gameCards = document.querySelectorAll(".game-card");
const itemList = document.getElementById("itemList");
const menuBtn = document.querySelector(".menu-btn");
const drawer = document.getElementById("drawer");
const overlay = document.getElementById("overlay");

// SELEKTOR SLIDER
const track = document.querySelector('.slides-track');
const allSlides = document.querySelectorAll(".slide"); 
const totalSlides = allSlides.length;
let index = 0;

// FUNGSI AUTO SLIDE (Hanya Perlu Satu)
function autoSlide() {
    index++;
    if (index >= totalSlides) {
        index = 0; // Kembali ke awal
    }
    if (track) {
        track.style.transform = `translateX(-${index * 100}%)`;
    }
}

// Jalankan slider setiap 3 detik
setInterval(autoSlide, 3000);

// NAVIGASI DRAWER
menuBtn.addEventListener("click", () => {
    drawer.classList.toggle("active");
    overlay.classList.toggle("active");
});

overlay.addEventListener("click", () => {
    drawer.classList.remove("active");
    overlay.classList.remove("active");
});

// LOGIKA PILIH GAME & FETCH DATA
gameCards.forEach(card => {
    card.addEventListener("click", async () => {
        // Efek aktif pada kartu
        gameCards.forEach(c => c.classList.remove("active"));
        card.classList.add("active");

        const currentGame = card.dataset.game;

        /* ===== SHOW LOADING ===== */
        itemList.innerHTML = `
            <div class="loading">
                <span class="loader"></span>
                Loading
            </div>
        `;

        try {
            // Delay halus untuk feel loading
            await new Promise(res => setTimeout(res, 600));

            const res = await fetch(`data/${currentGame}.json`);
            if (!res.ok) throw new Error("File tidak ditemukan");
            
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
            itemList.innerHTML = "<div class='loading' style='color: #ff6b6b;'>Data belum tersedia untuk game ini.</div>";
        }
    });
});
