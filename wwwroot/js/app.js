const API_URL = "/api/products";

let products = [];
let searchTimeout;

const totalProductsElement = document.getElementById("totalProducts");
const totalQuantityElement = document.getElementById("totalQuantity");
const inventoryValueElement = document.getElementById("inventoryValue");

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const productsTable = document.getElementById("productsTable");

const productModal = document.getElementById("productModal");
const productForm = document.getElementById("productForm");
const productIdInput = document.getElementById("productId");
const productNameInput = document.getElementById("productName");
const productCategoryInput = document.getElementById("productCategory");
const productPriceInput = document.getElementById("productPrice");
const productQuantityInput = document.getElementById("productQuantity");

const addProductBtn = document.getElementById("addProductBtn");
const cancelProductBtn = document.getElementById("cancelProductBtn");
const modalTitle = document.getElementById("modalTitle");
const saveProductBtn = document.getElementById("saveProductBtn");

const emptyState = document.getElementById("emptyState");
const loadingState = document.getElementById("loadingState");
const messageBox = document.getElementById("messageBox");
const formErrors = document.getElementById("formErrors");


const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
});

function formatCurrency(value) {
    return currencyFormatter.format(value);
}


async function loadProducts() {
    try {
        if (loadingState) {
            loadingState.hidden = false;
        }

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Could not load products.");
        }

        products = await response.json();

        updateCategoryOptions();
        updateDashboard();
        renderProducts();
    } catch (error) {
        console.error("Error loading products:", error);
        showMessage("Could not load products. Please check the server.", "error");
    } finally {
        if (loadingState) {
            loadingState.hidden = true;
        }
    }
}

function updateDashboard() {
    const quantity = products.reduce(
        (total, product) => total + product.quantity,
        0
    );

    const value = products.reduce(
        (total, product) => total + product.price * product.quantity,
        0
    );

    if (totalProductsElement) {
        totalProductsElement.textContent = products.length;
    }

    if (totalQuantityElement) {
        totalQuantityElement.textContent = quantity;
    }

    if (inventoryValueElement) {
        inventoryValueElement.textContent = formatCurrency(value);
    }
}

function updateCategoryOptions() {
    if (!categoryFilter) return;

    const selectedCategory = categoryFilter.value;

    const categories = [
        ...new Set(
            products
                .map(product => product.category)
                .filter(Boolean)
        )
    ].sort();

    categoryFilter.replaceChildren();

    const allOption = document.createElement("option");
    allOption.value = "";
    allOption.textContent = "All Categories";
    categoryFilter.appendChild(allOption);

    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    if (categories.includes(selectedCategory)) {
        categoryFilter.value = selectedCategory;
    }
}

function renderProducts() {
    if (!productsTable) {
        console.error("Element #productsTable was not found in index.html.");
        return;
    }

    const searchTerm = searchInput
        ? searchInput.value.trim().toLowerCase()
        : "";

    const selectedCategory = categoryFilter
        ? categoryFilter.value
        : "";

    const filteredProducts = products.filter((product) => {
      const matchesSearch = [
        product.id,
        product.name,
        product.category,
        product.price,
        product.quantity,
      ].some((value) => String(value).toLowerCase().includes(searchTerm));

      const matchesCategory =
        !selectedCategory || product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    productsTable.replaceChildren();

    filteredProducts.forEach((product, index) => {
        const row = document.createElement("tr");

        const idCell = document.createElement("td");
        idCell.textContent = index + 1;

        const nameCell = document.createElement("td");
        nameCell.textContent = product.name;

        const categoryCell = document.createElement("td");
        categoryCell.textContent = product.category;

        const priceCell = document.createElement("td");
        priceCell.textContent = formatCurrency(product.price);

        const quantityCell = document.createElement("td");
        quantityCell.textContent = product.quantity;

        const actionsCell = document.createElement("td");

        const editButton = document.createElement("button");
        editButton.className = "edit-button";
        editButton.type = "button";
        editButton.textContent = "Edit";
        editButton.addEventListener("click", () => openEditModal(product));

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-button";
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => deleteProduct(product.id));

        actionsCell.append(editButton, deleteButton);
        row.append(
          idCell,
          nameCell,
          categoryCell,
          priceCell,
          quantityCell,
          actionsCell,
        );

        productsTable.appendChild(row);
    });

    if (emptyState) {
        emptyState.hidden = filteredProducts.length > 0;
    }
}

function showMessage(message, type = "success") {
    if (!messageBox) {
        console.log(message);
        return;
    }

    messageBox.textContent = message;
    messageBox.dataset.type = type;
    messageBox.hidden = false;

    setTimeout(() => {
        messageBox.hidden = true;
    }, 4000);
}

function showFormErrors(messages) {
    if (!formErrors) return;

    formErrors.replaceChildren();

    messages.forEach(message => {
        const item = document.createElement("p");
        item.textContent = message;
        formErrors.appendChild(item);
    });

    formErrors.hidden = messages.length === 0;
}

function openAddModal() {
    if (!productModal || !productForm) {
        console.error("Product modal or form is missing from index.html.");
        return;
    }

    productForm.reset();
    productIdInput.value = "";

    if (modalTitle) {
        modalTitle.textContent = "Add Product";
    }

    if (saveProductBtn) {
        saveProductBtn.textContent = "Save Product";
    }

    showFormErrors([]);
    productModal.hidden = false;
}

function openEditModal(product) {
    if (!productModal || !productForm) return;

    productIdInput.value = product.id;
    productNameInput.value = product.name;
    productCategoryInput.value = product.category;
    productPriceInput.value = product.price;
    productQuantityInput.value = product.quantity;

    if (modalTitle) {
        modalTitle.textContent = "Edit Product";
    }

    if (saveProductBtn) {
        saveProductBtn.textContent = "Save Changes";
    }

    showFormErrors([]);
    productModal.hidden = false;
}

function closeModal() {
    if (productModal) {
        productModal.hidden = true;
    }

    if (productForm) {
        productForm.reset();
    }

    showFormErrors([]);
}

async function saveProduct(event) {
    event.preventDefault();

    showFormErrors([]);

    const id = productIdInput.value;

    const product = {
        name: productNameInput.value.trim(),
        category: productCategoryInput.value.trim(),
        price: Number(productPriceInput.value),
        quantity: Number(productQuantityInput.value)
    };

    const errors = [];

    if (!product.name) errors.push("Product name is required.");
    if (!product.category) errors.push("Category is required.");

    if (
        product.price < 0 ||
        !Number.isFinite(product.price) ||
        product.price > 1000000
    ) {
        errors.push("Price must be between 0 and 1,000,000.");
    }

    if (
        !Number.isInteger(product.quantity) ||
        product.quantity < 0 ||
        product.quantity > 1000000
    ) {
        errors.push("Quantity must be a whole number between 0 and 1,000,000.");
    }

    if (errors.length > 0) {
        showFormErrors(errors);
        return;
    }

    const url = id
        ? `${API_URL}/${id}`
        : API_URL;

    const method = id ? "PUT" : "POST";

    try {
        if (saveProductBtn) {
            saveProductBtn.disabled = true;
        }

        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(product)
        });

        if (!response.ok) {
            const responseText = await response.text();
            let errorMessage = "Could not save the product.";

            try {
                const errorData = JSON.parse(responseText);

                if (errorData.errors) {
                    const serverErrors = Object.values(errorData.errors).flat();
                    showFormErrors(serverErrors);
                    return;
                }
            } catch {
                // Response was not JSON.
            }

            throw new Error(errorMessage);
        }

        closeModal();
        await loadProducts();

        showMessage(
            id ? "Product updated successfully." : "Product added successfully."
        );
    } catch (error) {
        console.error("Error saving product:", error);
        showMessage(error.message || "Could not save the product.", "error");
    } finally {
        if (saveProductBtn) {
            saveProductBtn.disabled = false;
        }
    }
}

async function deleteProduct(id) {
    const product = products.find(item => item.id === id);

    if (!product) return;

    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Could not delete the product.");
        }

        await loadProducts();
        showMessage("Product deleted successfully.");
    } catch (error) {
        console.error("Error deleting product:", error);
        showMessage("Could not delete the product.", "error");
    }
}

if (searchInput) {
    searchInput.addEventListener("input", () => {
        clearTimeout(searchTimeout);

        searchTimeout = setTimeout(() => {
            renderProducts();
        }, 200);
    });
}

if (categoryFilter) {
    categoryFilter.addEventListener("change", renderProducts);
}

if (addProductBtn) {
    addProductBtn.addEventListener("click", openAddModal);
}

if (cancelProductBtn) {
    cancelProductBtn.addEventListener("click", closeModal);
}

if (productForm) {
    productForm.addEventListener("submit", saveProduct);
}

document.addEventListener("DOMContentLoaded", loadProducts);