const BACKEND_URL = "https://qr-photo-uploader-928035249768.me-west1.run.app";

const nameInput = document.getElementById("nameInput");
const photoInput = document.getElementById("photoInput");
const fileNameEl = document.getElementById("fileName");
const preview = document.getElementById("preview");
const uploadBtn = document.getElementById("uploadBtn");
const statusEl = document.getElementById("status");
const publicCheckbox = document.getElementById("publicCheckbox");

const btnText = uploadBtn.querySelector(".btnText");
const spinner = uploadBtn.querySelector(".spinner");

let selectedFile = null;
let uploading = false;

// ✅ simple gate: require landing password first
if (localStorage.getItem("landing_ok") !== "1") {
  window.location.href = "landing.html";
}

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

function updateUIFromFile() {
  if (!selectedFile) {
    fileNameEl.textContent = "לא נבחרה תמונה";
    preview.style.display = "none";
    uploadBtn.disabled = true;
    return;
  }

  fileNameEl.textContent = selectedFile.name || "נבחרה תמונה";
  preview.src = URL.createObjectURL(selectedFile);
  preview.style.display = "block";
  uploadBtn.disabled = false;
  setStatus("");
}

/**
 * iPhone Chrome reliability trick:
 * Sometimes the file appears slightly after the change event.
 */
function readFileFromInput() {
  selectedFile = photoInput.files && photoInput.files[0] ? photoInput.files[0] : null;
  updateUIFromFile();
}

photoInput.addEventListener("change", () => {
  readFileFromInput();
  setTimeout(readFileFromInput, 80);
  setTimeout(readFileFromInput, 200);
});

photoInput.addEventListener("input", () => {
  readFileFromInput();
  setTimeout(readFileFromInput, 80);
  setTimeout(readFileFromInput, 200);
});

uploadBtn.addEventListener("click", async () => {
  if (uploading) return;

  if (!selectedFile) {
    setStatus("❌ לא נבחרה תמונה. נסו לבחור שוב.", "err");
    return;
  }

  const rawName = (nameInput.value || "").trim();
  const safeName = rawName.length ? rawName : "ללא שם";

  const formData = new FormData();
  formData.append("photo", selectedFile);
  formData.append("name", safeName);

  // ✅ send visibility
  formData.append("visibility", publicCheckbox.checked ? "public" : "private");

  try {
    setUploading(true);
    setStatus("מעלה...");

    const res = await fetch(`${BACKEND_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "העלאה נכשלה");

    setStatus(`✅ הועלה בהצלחה`, "ok");

    // Reset for next upload
    selectedFile = null;
    photoInput.value = "";
    nameInput.value = "";
    publicCheckbox.checked = true; // ✅ reset default to everyone
    updateUIFromFile();

    setTimeout(() => setStatus(""), 3500);
  } catch (err) {
    setStatus(`❌ שגיאה: ${err.message}`, "err");
  } finally {
    setUploading(false);
  }
});
