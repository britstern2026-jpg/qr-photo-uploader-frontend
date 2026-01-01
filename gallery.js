const BACKEND_URL = "https://qr-photo-uploader-928035249768.me-west1.run.app";

const statusEl = document.getElementById("galleryStatus");
const gridEl = document.getElementById("galleryGrid");

function setStatus(msg, type = "") {
  statusEl.textContent = msg || "";
  statusEl.classList.remove("ok", "err");
  if (type === "ok") statusEl.classList.add("ok");
  if (type === "err") statusEl.classList.add("err");
}

async function loadGallery() {
  try {
    setStatus("טוען תמונות...");

    const res = await fetch(`${BACKEND_URL}/photos`, { method: "GET" });
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "שגיאה בטעינת גלריה");

    const photos = data.photos || [];
    if (!photos.length) {
      setStatus("אין עדיין תמונות בגלריה.", "ok");
      return;
    }

    setStatus(`✅ נמצאו ${photos.length} תמונות`, "ok");

    gridEl.innerHTML = "";

    for (const p of photos) {
      const card = document.createElement("div");
      card.className = "galleryItem";

      const img = document.createElement("img");
      img.src = p.url;
      img.alt = p.name;
      img.loading = "lazy";
      img.className = "galleryImg";

      card.appendChild(img);
      gridEl.appendChild(card);
    }
  } catch (err) {
    setStatus(`❌ ${err.message}`, "err");
  }
}

loadGallery();
