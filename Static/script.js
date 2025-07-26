window.addEventListener("DOMContentLoaded", () => {
  const scrollContainer = document.getElementById('autoScroll');

  if (!scrollContainer) return; // Safe guard

  let scrollAmount = 0;
  const scrollStep = 1;
  const scrollInterval = 20;

  function autoScroll() {
    scrollAmount += scrollStep;
    scrollContainer.scrollLeft += scrollStep;

    if (scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth) {
      scrollAmount = 0;
      scrollContainer.scrollLeft = 0;
    }
  }

  setInterval(autoScroll, scrollInterval);
});


  function toggleMenu() {
    const sideMenu = document.getElementById('sideMenu');
    sideMenu.classList.toggle('translate-x-full');
  }

  //uploadthings

  document.getElementById("productForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  formData.append("name", productName);
formData.append("price", productDescription); // assuming price ≈ description
  const fileInput = document.getElementById("uploadInput");
  const file = fileInput.files[0];

  if (!file) {
    alert("Please select an image.");
    return;
  }

  // UploadThing Direct Upload
  const formData = new FormData();
formData.append("image", file); // Change "files" ➜ "file" to match multer field name

try {
  const res = await fetch("http://localhost:5000/products", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  const imageUrl = data[0]?.fileUrl;

  if (!imageUrl) {
    alert("Image upload failed.");
    return;
  }

  const newProduct = {
    name: productName,
    description: productDescription,
    imageUrl,
  };

  const existing = JSON.parse(localStorage.getItem("myListings")) || [];
  existing.push(newProduct);
  localStorage.setItem("myListings", JSON.stringify(existing));

  alert("✅ Product posted!");
  window.location.href = "Userdashboard.html";

} catch (error) {
  console.error("Upload error:", error);
  alert("Upload failed.");
}
});

// Preview selected image inside the placeholder
function previewImage(event) {
  const file = event.target.files[0];
  const preview = document.getElementById("profileImagePreview");
  const placeholder = document.getElementById("uploadPlaceholder");

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
      preview.classList.remove("hidden");
      placeholder.classList.add("hidden");
    };
    reader.readAsDataURL(file);
  }
}

