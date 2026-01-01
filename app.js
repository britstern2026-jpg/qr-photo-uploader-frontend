const BACKEND_URL = "https://qr-photo-uploader-928035249768.me-west1.run.app";

const nameInput = document.getElementById("nameInput");
const photoInput = document.getElementById("photoInput");
const preview = document.getElementById("preview");
const uploadBtn = document.getElementById("uploadBtn");
const statusEl = document.getElementById("status");

const btnText = uploadBtn.querySelector(".btnText");
const spinner = uploadBtn.querySelector(".spinner");

let selectedFile = null;
let uploading = false;

function setStatus(msg, type = "") {
  statusEl.textContent = msg || "";
  statusEl.classList.remove("ok", "err");
  if (type === "ok") statusEl.classList.add("ok");
  if (type === "err") statusEl.classList.add("err");
}

function setUploading(isUploading) {
  uploading = isUploading;
  uploadBtn.disabled = isUploading || !selectedFile;
  spinner.style.display = isUploading ? "inline-block" : "none";
  btnText.textContent = isUploading ? "מעלה..." : "העלאה";
}

function resetForm() {
  selectedFile = null;
  photoInput.value = "";
  preview.src = "";
  preview.style.display = "none";
  uploadBtn.disabled = true;
}

function onFilePicked() {
  const f = photoInput.files && photoInput.files[0] ? photoInput.files[0] : null;
  selectedFile = f;

  if (!selectedFile) {
    uploadBtn.disabled = true;
    preview.style.display = "none";
    return;
  }

  preview.src = URL.createObjectURL(selectedFile);
  preview.style.display = "block";
  uploadBtn.disabled = false;
  setStatus("");
}

// extra reliable for iPhone
photoInput.addEventListener("change", () => {
  onFilePicked();
  setTimeout(onFilePicked, 50);
});

photoInput.addEventListener("input", () => {
  onFilePicked();
  setTimeout(onFilePicked, 50);
});

uploadBtn.addEventListener("click", async () => {
  if (uploading) return;

  if (!selectedFile) {
    setStatus("❌ לא נבחרה תמונה. נסו שוב.", "err");
    uploadBtn.disabled = true;
    return;
  }

  const rawName = (nameInput.value || "").trim();
  const safeName = rawName.length ? rawName : "תמונה";

  const formData = new FormData();
  formData.append("photo", selectedFile);
  formData.append("name", safeName);

  try {
    setUploading(true);
    setStatus("מעלה...");

    const res = await fetch(`${BACKEND_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload failed");

    setStatus(`✅ הועלה בהצלחה! (${data.objectName})`, "ok");
    resetForm();
    setTimeout(() => setStatus(""), 3500);
  } catch (err) {
    setStatus(`❌ שגיאה: ${err.message}`, "err");
  } finally {
    setUploading(false);
  }
});
