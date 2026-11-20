const nav = document.querySelector(".navbar");
document.querySelector(".menu-toggle").addEventListener("click", () => nav.classList.toggle("nav-open"));
document.querySelectorAll("nav a").forEach(a => a.addEventListener("click", () => nav.classList.remove("nav-open")));

const dateInput = document.querySelector('input[name="date"]');
const today = new Date();
const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0,10);
dateInput.min = localToday;

const form = document.getElementById("bookingForm");
const message = document.getElementById("bookingMessage");
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  message.textContent = "Sending your reservation request…";
  const fd = new FormData(form);
  const payload = Object.fromEntries(fd.entries());
  try {
    const response = await fetch("/book", {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(payload)});
    const result = await response.json();
    if (!response.ok || !result.ok) throw new Error(result.message || "Could not submit booking.");
    message.innerHTML = `${result.message}<br><small>Booking request ID: ${result.booking_id}</small>`;
    form.reset();
    dateInput.min = localToday;
  } catch (err) {
    message.textContent = err.message || "Something went wrong. Please try again.";
  }
});

const wheel = document.getElementById("wheel");
const spin = document.getElementById("spin");
const wheelResult = document.getElementById("wheelResult");
let rotation = 0, spinning = false;
const prizes = ["A complimentary dessert 🍰","A refreshing drink 🥤","10% off your next visit ✨","Try again next time 🎉","A side of fries 🍟","A surprise treat 🎁"];
spin.addEventListener("click", () => {
  if (spinning) return;
  spinning = true;
  spin.disabled = true;
  spin.textContent = "Spinning…";
  const prizeIndex = Math.floor(Math.random() * prizes.length);
  rotation += 1800 + (360 - prizeIndex * 60 - 30);
  wheel.style.transform = `rotate(${rotation}deg)`;
  wheelResult.textContent = "The wheel is spinning…";
  setTimeout(() => {
    wheelResult.textContent = `You won: ${prizes[prizeIndex]} (demo prize)`;
    spinning = false;
    spin.disabled = false;
    spin.innerHTML = "Spin again";
  }, 4100);
});
