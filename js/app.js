const gameCards = document.querySelectorAll(".game-card");
const itemList = document.getElementById("itemList");
const itemSection = document.querySelector(".item-list");
const priceSection = document.querySelector(".price");

let currentGame = "";
let currentGameName = "";

gameCards.forEach(card => {
  card.addEventListener("click", () => {

    // reset active
    gameCards.forEach(c => c.classList.remove("active"));

    // aktifkan card
    card.classList.add("active");

    // auto scroll ke item / harga
    setTimeout(() => {
      (itemSection || priceSection)?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 200);
  });
});


gameCards.forEach(card => {
  card.addEventListener("click", async () => {

    gameCards.forEach(c => c.classList.remove("active"));
    card.classList.add("active");

    currentGame = card.dataset.game;
    currentGameName = card.querySelector("span").textContent;

    itemList.innerHTML = "<div class='loading'>Loading...</div>";

    try {
      const res = await fetch(`data/${currentGame}.json`);
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
      itemList.innerHTML = "<div class='error'>Data tidak tersedia</div>";
      console.error(err);
    }
  });
});
