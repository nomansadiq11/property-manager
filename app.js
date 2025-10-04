const form = document.getElementById("propertyForm");
const results = document.getElementById("results");

let properties = JSON.parse(localStorage.getItem("properties")) || [];

function saveToLocal() {
  localStorage.setItem("properties", JSON.stringify(properties));
}

function calculateROI(purchase_price, annual_rent, annual_expenses) {
  const roi_gross = (annual_rent / purchase_price) * 100;
  const net_income = annual_rent - annual_expenses;
  const roi_net = (net_income / purchase_price) * 100;
  return { roi_gross, roi_net };
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = {
    property_name: document.getElementById("property_name").value,
    purchase_price: parseFloat(document.getElementById("purchase_price").value),
    year: document.getElementById("year").value,
    start_date: document.getElementById("start_date").value,
    end_date: document.getElementById("end_date").value,
    annual_rent: parseFloat(document.getElementById("annual_rent").value),
    annual_expenses: parseFloat(document.getElementById("annual_expenses").value),
    notes: document.getElementById("notes").value
  };

  const roi = calculateROI(data.purchase_price, data.annual_rent, data.annual_expenses);
  data.roi_gross = roi.roi_gross.toFixed(2);
  data.roi_net = roi.roi_net.toFixed(2);

  properties.push(data);
  saveToLocal();
  renderProperties();
  form.reset();
});

function renderProperties() {
  results.innerHTML = "<h2>Saved Properties</h2>";
  properties.forEach((p, i) => {
    results.innerHTML += `
      <div class="property-card">
        <strong>${p.property_name}</strong> (${p.year})<br>
        Rent: AED ${p.annual_rent} | Expenses: AED ${p.annual_expenses}<br>
        ROI Gross: ${p.roi_gross}% | ROI Net: ${p.roi_net}%<br>
        Notes: ${p.notes || '—'}<br>
        <button onclick="deleteProperty(${i})">🗑️ Delete</button>
      </div>`;
  });
}

function deleteProperty(i) {
  properties.splice(i, 1);
  saveToLocal();
  renderProperties();
}

renderProperties();

// PWA install support
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}
