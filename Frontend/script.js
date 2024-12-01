const API_URL = 'http://localhost:3000/products';

document.addEventListener('DOMContentLoaded', loadProducts);

function loadProducts() {
    fetch('http://localhost:3000/products')
        .then(response => response.json())
        .then(data => {
            if (!Array.isArray(data) || data.length === 0) {
                throw new Error('Invalid data format: products not found');
            }

            const productGrid = document.getElementById('product-grid');
            productGrid.innerHTML = '';  // Clear existing content before adding new products

            data.forEach(product => {
                const productCard = document.createElement('div');
                productCard.classList.add('card', 'col-md-3');

                const productImage = document.createElement('img');
                productImage.src = 'default-image.jpg';  // Add a default image or real image path
                productImage.classList.add('card-img-top');

                const productBody = document.createElement('div');
                productBody.classList.add('card-body');

                const productName = document.createElement('h5');
                productName.classList.add('card-title');
                productName.innerText = product.name;

                const productPrice = document.createElement('p');
                productPrice.classList.add('card-text');
                productPrice.innerText = `$${product.price}`;

                // Create Edit and Delete buttons
                const editButton = document.createElement('button');
                editButton.classList.add('btn', 'btn-warning', 'btn-sm');
                editButton.innerText = 'Edit';
                editButton.addEventListener('click', () => editProduct(product.id));

                const deleteButton = document.createElement('button');
                deleteButton.classList.add('btn', 'btn-danger', 'btn-sm');
                deleteButton.innerText = 'Delete';
                deleteButton.addEventListener('click', () => deleteProduct(product.id));

                // Append buttons to the card
                productBody.appendChild(productName);
                productBody.appendChild(productPrice);
                productBody.appendChild(editButton);
                productBody.appendChild(deleteButton);

                productCard.appendChild(productImage);
                productCard.appendChild(productBody);

                productGrid.appendChild(productCard);
            });
        })
        .catch(error => {
            console.error('Error loading products:', error);
        });
}

document.addEventListener('DOMContentLoaded', loadProducts);

function editProduct(productId) {
    const productName = prompt('Enter new product name:');
    const productPrice = prompt('Enter new product price:');

    if (productName && productPrice) {
        const updatedProduct = { name: productName, price: parseFloat(productPrice) };

        fetch(`http://localhost:3000/products/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedProduct),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Product updated:', data);
                loadProducts();  // Reload products after update
            })
            .catch(error => {
                console.error('Error updating product:', error);
            });
    }
}

function deleteProduct(productId) {
    const confirmDelete = confirm('Are you sure you want to delete this product?');

    if (confirmDelete) {
        fetch(`http://localhost:3000/products/${productId}`, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(data => {
                console.log('Product deleted:', data);
                loadProducts();  // Reload products after deletion
            })
            .catch(error => {
                console.error('Error deleting product:', error);
            });
    }
}


function renderProduct(product) {
    const productDiv = document.createElement('div');
    productDiv.classList.add('product');

    productDiv.innerHTML = `
        <h3>${product.name}</h3>
        <p>Price: $${product.price.toFixed(2)}</p>
        <button onclick="deleteProduct(${product.id})">Delete</button>
        <button onclick="editProduct(${product.id}, '${product.name}', ${product.price})">Edit</button>
    `;

    document.getElementById('product-list').appendChild(productDiv);
}

document.getElementById('add-product-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('product-name').value;
    const price = parseFloat(document.getElementById('product-price').value);

    addProduct(name, price);
});

async function addProduct(name, price) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, price }),
        });

        const result = await response.json();
        if (!result.error) {
            alert('Product added successfully!');
            loadProducts(); // Refresh the list
        }
    } catch (error) {
        console.error('Error adding product:', error);
    }
}

async function updateProduct(id, name, price) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, price }),
        });

        const result = await response.json();
        if (!result.error) {
            alert('Product updated successfully!');
            loadProducts();
        }
    } catch (error) {
        console.error('Error updating product:', error);
    }
}

async function deleteProduct(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        const result = await response.json();

        if (!result.error) {
            alert('Product deleted successfully!');
            loadProducts();
        }
    } catch (error) {
        console.error('Error deleting product:', error);
    }
}

function editProduct(id, currentName, currentPrice) {
    const newName = prompt('Enter new name:', currentName);
    const newPrice = parseFloat(prompt('Enter new price:', currentPrice));

    if (newName && !isNaN(newPrice)) {
        updateProduct(id, newName, newPrice);
    }
}
