let properties = JSON.parse(localStorage.getItem("properties")) || [];

function saveToLocal() {
  localStorage.setItem("properties", JSON.stringify(properties));
}

function calculateROI(price, rent, expenses) {
  const roiGross = (rent / price) * 100;
  const roiNet = ((rent - expenses) / price) * 100;
  return { roiGross, roiNet };
}

function renderSummary() {
  const totalRent = properties.reduce((sum, p) => sum + p.annual_rent, 0);
  const avgROI = properties.length
    ? properties.reduce((sum, p) => sum + parseFloat(p.roi_net), 0) / properties.length
    : 0;

  document.getElementById("totalRent").innerText = `AED ${totalRent.toLocaleString()}`;
  document.getElementById("avgROI").innerText = `${avgROI.toFixed(2)}%`;
}

function renderProperties() {
  const list = document.getElementById("propertyList");
  list.innerHTML = "";

  if (properties.length === 0) {
    list.innerHTML = "<p>No properties added yet.</p>";
    renderSummary();
    return;
  }

  properties.forEach((p, i) => {
    const card = document.createElement("div");
    card.className = "property-card";
    card.innerHTML = `
      <strong>${p.property_name}</strong> (${p.year})<br>
      Rent: AED ${p.annual_rent} | Exp: AED ${p.annual_expenses}<br>
      ROI: ${p.roi_net}%<br>
      <small>${p.notes || ""}</small>
      <br><button onclick="deleteProperty(${i})">🗑️ Delete</button>
    `;
    list.appendChild(card);
  });

  renderSummary();
}

function deleteProperty(index) {
  properties.splice(index, 1);
  saveToLocal();
  renderProperties();
}

// Modal controls
const modal = document.getElementById("propertyModal");
document.getElementById("openModal").addEventListener("click", () => modal.style.display = "flex");
document.getElementById("closeModal").addEventListener("click", () => modal.style.display = "none");

const form = document.getElementById("propertyForm");
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = {
    property_name: form.property_name.value,
    purchase_price: parseFloat(form.purchase_price.value),
    year: form.year.value,
    start_date: form.start_date.value,
    end_date: form.end_date.value,
    annual_rent: parseFloat(form.annual_rent.value),
    annual_expenses: parseFloat(form.annual_expenses.value),
    notes: form.notes.value
  };

  const roi = calculateROI(data.purchase_price, data.annual_rent, data.annual_expenses);
  data.roi_gross = roi.roiGross.toFixed(2);
  data.roi_net = roi.roiNet.toFixed(2);

  properties.push(data);
  saveToLocal();
  renderProperties();
  modal.style.display = "none";
  form.reset();
});

window.onclick = function(event) {
  if (event.target === modal) modal.style.display = "none";
};

renderProperties();
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}
