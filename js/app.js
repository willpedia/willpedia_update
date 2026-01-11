const gameCards = document.querySelectorAll(".game-card");
const itemList = document.getElementById("itemList");

let currentGame = "";
let currentGameName = "";

const phone = "628xxxxxxxxxx"

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
