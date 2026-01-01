// ✅ Change this if Cloud Run URL changes
const BACKEND_URL = "https://qr-photo-uploader-928035249768.me-west1.run.app";

const statusEl = document.getElementById("galleryStatus");
const gridEl = document.getElementById("galleryGrid");
const countEl = document.getElementById("galleryCount");

async function loadPhotos() {
  statusEl.textContent = "טוען תמונות...";
  gridEl.innerHTML = "";
  countEl.textContent = "";

  try {
    const res = await fetch(`${BACKEND_URL}/photos`, {
      method: "GET",
      headers: { "Accept": "application/json" }
    });

    const data = await res.json();

    if (!res.ok || !data.ok) {
      throw new Error(data.error || "Failed to load gallery");
    }

    const photos = data.photos || [];
    countEl.textContent = `✅ נמצאו ${photos.length} תמונות`;

    if (photos.length === 0) {
      statusEl.textContent = "אין תמונות להצגה כרגע.";
      return;
    }

    statusEl.textContent = "";

    photos.forEach((p) => {
      const card = document.createElement("a");
      card.className = "photoCard";
      card.href = p.signedUrl;
      card.target = "_blank";
      card.rel = "noopener";

      const img = document.createElement("img");
      img.className = "photoImg";
      img.loading = "lazy";
      img.alt = p.name;
      img.src = p.signedUrl;

      const meta = document.createElement("div");
      meta.className = "photoMeta";
      meta.textContent = p.name;

      card.appendChild(img);
      card.appendChild(meta);
      gridEl.appendChild(card);
    });

  } catch (err) {
    console.error(err);
    statusEl.textContent = `❌ שגיאה: ${err.message}`;
  }
}

loadPhotos();
