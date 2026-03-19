const apiBase = "/api/items";
console.log("🔥 JS LOADED");
const elements = {
  form: document.getElementById("itemForm"),
  itemId: document.getElementById("itemId"),
  name: document.getElementById("name"),
  description: document.getElementById("description"),
  quantity: document.getElementById("quantity"),
  price: document.getElementById("price"),
  saveBtn: document.getElementById("saveBtn"),
  resetBtn: document.getElementById("resetBtn"),
  message: document.getElementById("message"),
  itemsTable: document.getElementById("itemsTable"),
  search: document.getElementById("search")
};
let currentItems = [];
const showMessage = (text, type = "info") => {
  const msg = document.createElement("div");
  msg.textContent = text;
  msg.className = `toast ${type}`;

  document.body.appendChild(msg);

  setTimeout(() => {
    msg.remove();
  }, 3000);
};

const clearForm = () => {
  elements.itemId.value = "";
  elements.name.value = "";
  elements.description.value = "";
  elements.quantity.value = 0;
  elements.price.value = 0;
  elements.saveBtn.textContent = "Save";
};

const fetchItems = async () => {
  const res = await fetch("/api/items");
  return res.json();
};

const renderItems = (items) => {
  const table = elements.itemsTable;
  table.innerHTML = "";

  items.forEach((item) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.description}</td>
      <td>${item.quantity}</td>
      <td>${item.price}</td>
      <td>
        <button class="btn-edit" data-id="${item._id}">Edit</button>
        <button class="btn-delete" data-id="${item._id}">Delete</button>
      </td>
    `;

    table.appendChild(row);
  });
};
    

const setFormForEdit = (item) => {
  elements.itemId.value = item._id;
  elements.name.value = item.name;
  elements.description.value = item.description || "";
  elements.quantity.value = item.quantity;
  elements.price.value = item.price;
  elements.saveBtn.textContent = "Update";
  showMessage("Editing item. Press Clear to reset.");
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const saveItem = async () => {
  const payload = {
    name: elements.name.value.trim(),
    description: elements.description.value.trim(),
    quantity: Number(elements.quantity.value),
    price: Number(elements.price.value)
  };

  if (!payload.name) {
    showMessage("Name is required.", "error");
    return;
  }

  const method = elements.itemId.value ? "PUT" : "POST";
  const url = elements.itemId.value ? `${apiBase}/${elements.itemId.value}` : apiBase;

  try {
    const resp = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!resp.ok) {
      const error = await resp.json();
      throw new Error(error.message || "Failed to save item");
    }

    const saved = await resp.json();
    showMessage(`Item ${method === "POST" ? "created" : "updated"} successfully!`, "success");
    clearForm();
    loadItems();
  } catch (err) {
    console.error(err);
    showMessage(err.message || "Unable to save item", "error");
  }
};

const deleteItem = async (id) => {
  if (!confirm("Delete this item?")) return;

  try {
    const resp = await fetch(`${apiBase}/${id}`, { method: "DELETE" });
    if (!resp.ok) {
      const error = await resp.json();
      throw new Error(error.message || "Failed to delete item");
    }

    showMessage("Item deleted", "success");
    loadItems();
  } catch (err) {
    console.error(err);
    showMessage(err.message || "Unable to delete item", "error");
  }
};

const setupEvents = () => {
  elements.form.addEventListener("submit", (event) => {
    event.preventDefault();
    saveItem();
  });}

  elements.resetBtn.addEventListener("click", () => {
    clearForm();
    showMessage("Form cleared.");
  });

  elements.search.addEventListener("input", () => {
  const keyword = elements.search.value.toLowerCase();

  const filtered = currentItems.filter(item =>
    item.name.toLowerCase().includes(keyword)
  );
    // 🔥 ENTER KEY TO SAVE
  document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const active = document.activeElement;

      if (elements.form.contains(active) && active.tagName !== "BUTTON") {
        event.preventDefault();
        saveItem();
      }
    }
  });

  renderItems(filtered);
});
  ;

  elements.itemsTable.addEventListener("click", (event) => {
  const editBtn = event.target.closest(".btn-edit");
  const delBtn = event.target.closest(".btn-delete");

  if (editBtn) {
    const id = editBtn.dataset.id;
    const item = currentItems.find(i => i._id === id);
    setFormForEdit(item);
  }

  if (delBtn) {
    const id = delBtn.dataset.id;
    deleteItem(id);
  }
});

const loadItems = async () => {
  const items = await fetchItems();
  currentItems = items; // ✅ IMPORTANT
  renderItems(items);
};

const init = () => {
  setupEvents();
  loadItems();
};

init();
const renderChart = (items) => {
  const ctx = document.getElementById("chart");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: items.map(i => i.name),
      datasets: [{
        label: "Quantity",
        data: items.map(i => i.quantity),
      }]
    }
  });
};