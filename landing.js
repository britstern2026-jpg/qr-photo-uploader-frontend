const LANDING_PASSWORD = "1234"; // ✅ change this
const REDIRECT_TO = "index.html";

const pwInput = document.getElementById("pw");
const enterBtn = document.getElementById("enterBtn");
const statusEl = document.getElementById("status");

const btnText = enterBtn.querySelector(".btnText");
const spinner = enterBtn.querySelector(".spinner");

function setStatus(msg, type = "") {
  statusEl.textContent = msg || "";
  statusEl.classList.remove("ok", "err");
  if (type === "ok") statusEl.classList.add("ok");
  if (type === "err") statusEl.classList.add("err");
}

function setLoading(isLoading) {
  enterBtn.disabled = isLoading;
  spinner.style.display = isLoading ? "inline-block" : "none";
  btnText.textContent = isLoading ? "בודק..." : "כניסה";
}

function tryEnter() {
  const pw = (pwInput.value || "").trim();

  if (!pw) {
    setStatus("❌ יש להזין סיסמה", "err");
    return;
  }

  if (pw !== LANDING_PASSWORD) {
    setStatus("❌ סיסמה לא נכונה", "err");
    return;
  }

  setLoading(true);
  setStatus("✅ הצלחה! מעביר...", "ok");

  // ✅ Save “logged in” flag for this browser
  localStorage.setItem("landing_ok", "1");

  setTimeout(() => {
    window.location.href = REDIRECT_TO;
  }, 400);
}

// button click
enterBtn.addEventListener("click", tryEnter);

// enter key
pwInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") tryEnter();
});

// optional: if already logged in, go straight in
if (localStorage.getItem("landing_ok") === "1") {
  window.location.href = REDIRECT_TO;
}
