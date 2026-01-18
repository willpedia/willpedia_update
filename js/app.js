// SELEKTOR UTAMA
const gameCards = document.querySelectorAll(".game-card");
const itemList = document.getElementById("itemList");
const menuBtn = document.querySelector(".menu-btn");
const drawer = document.getElementById("drawer");
const overlay = document.getElementById("overlay");

// SELEKTOR SLIDER UNTUK INFINITE LOOP
const track = document.querySelector('.slides-track');
const allSlides = document.querySelectorAll(".slide"); 
const totalSlides = allSlides.length; // Sekarang ini akan menjadi 4 (3 slide asli + 1 klon)
let index = 0; // Mulai dari slide pertama (index 0)

// FUNGSI AUTO SLIDE DENGAN EFEK INFINITE LOOP
function autoSlide() {
    index++; // Pindah ke slide berikutnya

    // Set transisi agar animasi geser terlihat
    track.style.transition = "transform 0.6s ease-in-out";
    track.style.transform = `translateX(-${index * 100}%)`;

    // Jika sudah mencapai slide klon (slide terakhir yang menduplikasi slide pertama)
    if (index === totalSlides - 1) { // totalSlides - 1 adalah index dari slide klon
        setTimeout(() => {
            // Setelah animasi geser ke klon selesai, langsung pindah ke slide pertama (index 0)
            // Tanpa transisi agar tidak terlihat melompat balik
            track.style.transition = "none";
            index = 0; // Reset index ke awal
            track.style.transform = `translateX(0)`; // Pindah posisi ke slide pertama
        }, 600); // Waktu ini harus sama dengan durasi transisi di CSS (0.6s = 600ms)
    }
}

// Jalankan auto-slide setiap 3 detik
setInterval(autoSlide, 3000);

// NAVIGASI DRAWER (Hamburger Menu)
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
        // Efek aktif pada kartu game yang dipilih
        gameCards.forEach(c => c.classList.remove("active"));
        card.classList.add("active");

        const currentGame = card.dataset.game;

        /* ===== TAMPILKAN LOADING ===== */
        itemList.innerHTML = `
            <div class="loading">
                <span class="loader"></span>
                Loading
            </div>
        `;

        try {
            // Delay halus untuk pengalaman pengguna (simulasi loading)
            await new Promise(res => setTimeout(res, 600));

            const res = await fetch(`data/${currentGame}.json`);
            if (!res.ok) { // Cek jika response tidak OK (misal: 404 Not Found)
                throw new Error("File data game tidak ditemukan.");
            }
            
            const data = await res.json();
            itemList.innerHTML = ""; // Bersihkan loading

            // Tampilkan item-item game
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
            console.error("Error fetching data:", err); // Log error ke console
            itemList.innerHTML = "<div class='loading' style='color: #ff6b6b;'>Data belum tersedia untuk game ini.</div>";
        }
    });
});
