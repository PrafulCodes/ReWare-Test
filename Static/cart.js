document.addEventListener("DOMContentLoaded", () => {
  const cartButtons = document.querySelectorAll(".add-to-cart-btn");

  cartButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest("div");

      const product = {
        name: card.querySelector(".product-name")?.textContent.trim(),
        price: card.querySelector(".product-price")?.textContent.trim(),
        image: card.querySelector("img")?.getAttribute("src")
      };

      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      cart.push(product);

      localStorage.setItem("cart", JSON.stringify(cart));

      alert(`✅ "${product.name}" added to cart!`);

      // Navigate to cart page
      window.location.href = "../Templates/cart.html";
    });
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const cartData = JSON.parse(localStorage.getItem("cart")) || [];

  let total = 0;

  cartData.forEach(item => {
    const price = parseFloat(item.price?.replace("₹", "").replace(",", "").trim());
    if (!isNaN(price)) {
      total += price;
    }
  });

  // Show total price in the input box
  const priceInput = document.getElementById("productPrice");
  if (priceInput) {
    priceInput.value = total.toFixed(2);
  }

  // Add checkout button if not already present
  let existingCheckout = document.getElementById("checkoutButton");
  if (!existingCheckout) {
    const checkoutBox = document.createElement("div");
    checkoutBox.className = "mt-4 flex justify-end";

    const button = document.createElement("button");
    button.id = "checkoutButton";
    button.textContent = "Checkout";
    button.className = "bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded cursor:pointer";

    button.addEventListener("click", () => {
      alert("Sorry it's under maintanance");
      // You can redirect or open payment here
    });

    checkoutBox.appendChild(button);

    // Append below the price input
    const priceInputParent = priceInput?.parentElement;
    if (priceInputParent) {
      priceInputParent.appendChild(checkoutBox);
    }
  }
});

