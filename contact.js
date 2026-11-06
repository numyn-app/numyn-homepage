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
