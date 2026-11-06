const form = document.getElementById("contact-form");
const submit = form.querySelector("button[type=submit]");
const status = document.getElementById("form-status");
const topics = new Map([
  ["software", "Custom software"],
  ["support", "IT support"],
  ["maintenance", "IT maintenance agreement"],
]);
const topic = topics.get(new URLSearchParams(location.search).get("topic"));
if (topic) form.elements.subject.value = topic;

submit.disabled = false;
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const payload = Object.fromEntries(new FormData(form));
  if (!payload.message.trim()) {
    status.textContent = "Enter a message before sending.";
    form.elements.message.focus();
    return;
  }

  submit.disabled = true;
  status.textContent = "Sending…";
  try {
    const response = await fetch("https://api.numyn.ca/api/v1/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!response.ok || !result.ok) throw new Error("Contact request failed");
    form.reset();
    if (topic) form.elements.subject.value = topic;
    status.textContent = "Message sent. Thanks for getting in touch.";
  } catch {
    status.textContent = "We couldn’t confirm delivery. You can also email hello@numyn.ca.";
  } finally {
    submit.disabled = false;
  }
});

const apiStatus = document.getElementById("api-status");
const apiHistory = document.getElementById("api-history");
const historyKey = "numyn-api-uptime-history";
const labels = { up: "Operational", degraded: "Service degraded", down: "Couldn’t verify status" };

function recordApiCheck(state) {
  let history = [];
  try {
    const saved = JSON.parse(localStorage.getItem(historyKey) || "[]");
    if (Array.isArray(saved)) history = saved.filter(sample => sample && Object.hasOwn(labels, sample.status));
  } catch {
    // Display the current check even if stored history cannot be read.
  }
  history = [...history, { status: state, t: Date.now() }].slice(-22);
  try {
    localStorage.setItem(historyKey, JSON.stringify(history));
  } catch {
    // The current page still shows the check.
  }
  apiHistory.replaceChildren(...history.map(sample => {
    const blip = document.createElement("span");
    blip.className = "api-blip";
    blip.dataset.state = sample.status;
    blip.title = labels[sample.status] + " · " + new Date(sample.t).toLocaleString();
    blip.setAttribute("role", "img");
    blip.setAttribute("aria-label", blip.title);
    return blip;
  }));
  apiStatus.textContent = labels[state];
}

async function checkFormsApi() {
  apiStatus.textContent = "Checking…";
  try {
    const response = await fetch("https://api.numyn.ca/api/v1/health", {
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    const health = await response.json();
    recordApiCheck(response.ok && health.ok ? "up" : "degraded");
  } catch {
    recordApiCheck("down");
  }
}
checkFormsApi();
