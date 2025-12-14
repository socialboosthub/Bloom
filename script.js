// -------- SLIDER --------
const slides = document.querySelectorAll(".slide");
let current = 0;
const slideInterval = 10000;

function showSlide(index) {
  slides.forEach((slide, i) => slide.classList.toggle("active", i === index));
}
if (slides.length) {
  showSlide(0);
  setInterval(() => {
    current = (current + 1) % slides.length;
    showSlide(current);
  }, slideInterval);
}

// -------- COUNTRY API --------
// Load Countries
async function loadCountries() {
  try {
    const res = await fetch(
      "https://countriesnow.space/api/v0.1/countries/positions"
    );
    const data = await res.json();
    const countrySelect = document.getElementById("country");
    if (data && data.data && countrySelect) {
      data.data.forEach((c) => {
        const opt = document.createElement("option");
        opt.value = c.name;
        opt.textContent = c.name;
        countrySelect.appendChild(opt);
      });
    }
  } catch (err) {
    console.error("Could not load countries", err);
  }
}

// Load States
async function loadStates(country) {
  try {
    const res = await fetch(
      "https://countriesnow.space/api/v0.1/countries/states",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country }),
      }
    );
    const data = await res.json();
    const countySelect = document.getElementById("county");
    if (!countySelect) return;
    countySelect.innerHTML = "<option value=''>Select County / State</option>";
    if (data && data.data && Array.isArray(data.data.states)) {
      data.data.states.forEach((state) => {
        const opt = document.createElement("option");
        opt.value = state.name;
        opt.textContent = state.name;
        countySelect.appendChild(opt);
      });
    }
  } catch (err) {
    console.error("Could not load states", err);
  }
}

// Load Cities
async function loadCities(country, state) {
  try {
    const res = await fetch(
      "https://countriesnow.space/api/v0.1/countries/state/cities",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country, state }),
      }
    );
    const data = await res.json();
    const subcountySelect = document.getElementById("subcounty");
    if (!subcountySelect) return;
    subcountySelect.innerHTML =
      "<option value=''>Select City / Subcounty</option>";
    if (data && Array.isArray(data.data)) {
      data.data.forEach((city) => {
        const opt = document.createElement("option");
        opt.value = city;
        opt.textContent = city;
        subcountySelect.appendChild(opt);
      });
    }
  } catch (err) {
    console.error("Could not load cities", err);
  }
}

// -------- POPUP --------
function showPopup(message, color) {
  const popup = document.getElementById("popup");
  const popupText = document.getElementById("popupText");
  popupText.textContent = message;
  popupText.style.color = color || "#111";
  popup.style.display = "flex";
  popup.setAttribute("aria-hidden", "false");
  document.getElementById("closePopup").onclick = () => {
    popup.style.display = "none";
    popup.setAttribute("aria-hidden", "true");
  };
}

// -------- FORM LISTENERS --------
document.getElementById("country").addEventListener("change", function () {
  loadStates(this.value);
});
document.getElementById("county").addEventListener("change", function () {
  const country = document.getElementById("country").value;
  loadCities(country, this.value);
});
loadCountries();

// -------- FORM SUBMIT HANDLER --------
document
  .getElementById("contact-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const country = document.getElementById("country").value;

    if (!name || !phone || !email || !country) {
      showPopup("Please fill all required fields.", "red");
      return;
    }

    if (country === "Kenya") {
      showPopup(
        "Your order has been received! We will respond shortly.",
        "blue"
      );
      // send to emailjs (fire-and-forget)
      try {
        emailjs
          .send("service_71ol8ee", "template_ht3t1cn", {
            name,
            phone,
            email,
            design:
              document.querySelector('input[name="design"]:checked')?.value ||
              "Not selected",
            color:
              document.querySelector('input[name="color"]:checked')?.value ||
              "Not selected",
            country,
            county: document.getElementById("county").value,
            subcounty: document.getElementById("subcounty").value,
            location: document.getElementById("location").value,
          })
          .catch((err) => console.error("EmailJS error", err));
      } catch (err) {
        console.warn("EmailJS send skipped (init/send error)", err);
      }
    } else {
      showPopup("Sorry! We currently don't deliver to your country.", "red");
    }
  });

// NAV hamburger
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navLinks.classList.toggle("open");
});

// highlight active link
const links = document.querySelectorAll(".nav-links a");
links.forEach((link) => {
  link.addEventListener("click", () => {
    links.forEach((l) => l.classList.remove("active"));
    link.classList.add("active");
  });
});

// reveal animation for cards on scroll
const cards = document.querySelectorAll(".bouquet-card");
window.addEventListener("scroll", () => {
  cards.forEach((card) => {
    const rect = card.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      card.style.opacity = 1;
      card.style.transform = "translateY(0)";
    }
  });
});
