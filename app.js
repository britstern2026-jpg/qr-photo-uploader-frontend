const BACKEND_URL = "https://qr-photo-uploader-928035249768.me-west1.run.app";

const nameInput = document.getElementById("nameInput");
const photoInput = document.getElementById("photoInput");
const preview = document.getElementById("preview");
const uploadBtn = document.getElementById("uploadBtn");
const statusEl = document.getElementById("status");

let selectedFile = null;

photoInput.addEventListener("change", () => {
  selectedFile = photoInput.files[0];
  if (selectedFile) {
    preview.src = URL.createObjectURL(selectedFile);
    preview.style.display = "block";
  }
});

uploadBtn.addEventListener("click", async () => {
  if (!selectedFile) {
    statusEl.textContent = "❌ Please take/select a photo first.";
    return;
  }

  statusEl.textContent = "Uploading...";

  const formData = new FormData();
  formData.append("photo", selectedFile);
  formData.append("name", nameInput.value || "photo");

  try {
    const res = await fetch(`${BACKEND_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      statusEl.textContent = "❌ Upload failed: " + (data.error || "unknown error");
      return;
    }

    statusEl.textContent = `✅ Uploaded successfully! (${data.objectName})`;
  } catch (err) {
    statusEl.textContent = "❌ Error: " + err.message;
  }
});
