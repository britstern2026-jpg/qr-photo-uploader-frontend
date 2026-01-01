const photoInput = document.getElementById("photoInput");
const pickBtn = document.getElementById("pickBtn");
const uploadBtn = document.getElementById("uploadBtn");
const preview = document.getElementById("preview");
const statusEl = document.getElementById("status");
const nameInput = document.getElementById("nameInput");
const fileNameEl = document.getElementById("fileName");
const publicCheckbox = document.getElementById("publicCheckbox");

let selectedFile = null;

// ✅ Cloud Run backend
const BACKEND_URL = "https://qr-photo-uploader-928035249768.me-west1.run.app";

// ✅ Open file picker / camera
pickBtn.addEventListener("click", () => {
  photoInput.click();
});

// ✅ iPhone Chrome sometimes needs a small delay
photoInput.addEventListener("change", async () => {
  statusEl.textContent = "";
  statusEl.className = "status";

  const file = photoInput.files && photoInput.files[0];
  if (!file) return;

  // iOS/Chrome quirk: wait a tick so file is fully available
  await new Promise((r) => setTimeout(r, 250));

  selectedFile = file;
  fileNameEl.textContent = `נבחר: ${file.name}`;

  preview.src = URL.createObjectURL(selectedFile);
  preview.style.display = "block";

  uploadBtn.disabled = false;
});

// ✅ Upload
uploadBtn.addEventListener("click", async () => {
  if (!selectedFile) return;

  uploadBtn.disabled = true;
  statusEl.textContent = "מעלה...";
  statusEl.className = "status";
  const spinner = document.querySelector(".spinner");
  if (spinner) spinner.style.display = "inline-block";

  const formData = new FormData();
  formData.append("photo", selectedFile);
  formData.append("name", nameInput.value.trim());

  // ✅ NEW: visibility field
  // checked = public (everyone), unchecked = private (event owner)
  formData.append("visibility", publicCheckbox.checked ? "public" : "private");

  try {
    const res = await fetch(`${BACKEND_URL}/upload`, {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload failed");

    statusEl.textContent = `✅ הועלה בהצלחה: ${data.objectName}`;
    statusEl.className = "status ok";

    // reset UI
    selectedFile = null;
    photoInput.value = "";
    fileNameEl.textContent = "";
    preview.style.display = "none";
    nameInput.value = "";
    publicCheckbox.checked = true; // ✅ reset default to everyone
  } catch (err) {
    statusEl.textContent = `❌ שגיאה: ${err.message}`;
    statusEl.className = "status err";
    uploadBtn.disabled = false;
  } finally {
    if (spinner) spinner.style.display = "none";
  }
});
