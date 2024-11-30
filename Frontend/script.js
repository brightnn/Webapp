const API_URL = 'http://localhost:3000/products';

document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch(API_URL);
    const products = await response.json();

    const productGrid = document.getElementById('product-grid');

    products.forEach(product => {
        const productCard = `
            <div class="col-md-4">
                <div class="card h-100">
                    <img src="${product.image_url}" class="card-img-top" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.description}</p>
                        <p class="card-text"><strong>$${product.price}</strong></p>
                        <a href="#" class="btn btn-primary">Add to Cart</a>
                    </div>
                </div>
            </div>
        `;
        productGrid.innerHTML += productCard;
    });
});
