const gameCards = document.querySelectorAll(".game-card");
const itemList = document.getElementById("itemList");
const itemSection = document.querySelector(".item-list");
const priceSection = document.querySelector(".price");

let currentGame = "";
let currentGameName = "";

gameCards.forEach(card => {
  card.addEventListener("click", async () => {

    gameCards.forEach(c => c.classList.remove("active"));
    card.classList.add("active");

    currentGame = card.dataset.game;
    currentGameName = card.querySelector("span")?.textContent || "";

    /* ===== SHOW LOADING ===== */
    itemList.innerHTML = `
      <div class="loading">
        <span class="loader"></span>
        Loading
      </div>
    `;

    setTimeout(() => {
      (itemSection || priceSection)?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 150);

    try {
      /* ===== FORCE DELAY (300ms) ===== */
      await new Promise(res => setTimeout(res, 300));

      const res = await fetch(`data/${currentGame}.json`);
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
      itemList.innerHTML = "<div class='error'>Data tidak tersedia</div>";
    }
  });
});
