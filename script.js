let data;

async function fetchData() {
    try {
        const response = await fetch('https://3sb655pz3a.execute-api.ap-southeast-2.amazonaws.com/live/product');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

function updateProductDetails(data) {
    const productNameElement = document.querySelector('.product-name');
    const productPriceElement = document.querySelector('.product-price');
    const productExplanationElement = document.querySelector('.product-explaination');
    const productImageElement = document.querySelector('.product-image');

    if (data) {
        productNameElement.textContent = data.title;
        productPriceElement.textContent = `$${data.price}.00`; //TODO
        productExplanationElement.textContent = data.description;
        productImageElement.innerHTML = `<img src="${data.imageURL}" alt="${data.title}" />`;
    } else {
        productNameElement.textContent = 'Error fetching product details';
    }
}



document.addEventListener('DOMContentLoaded', function() {
    const sizeDropdown = document.getElementById('size');
    const addToCartButton = document.getElementById('add-to-cart');
    const selectedSizeElement = document.getElementById('size');
    const cartItemsList = document.getElementById('cart-items');


    let cartItems = [];


    function fetchProductSizes() {
        fetch('https://3sb655pz3a.execute-api.ap-southeast-2.amazonaws.com/live/product')
            .then(response => response.json())
            .then(data => {
                const sizeOptions = data.sizeOptions;
                sizeOptions.forEach(size => {
                    const option = document.createElement('option');
                    option.value = size.label;
                    option.textContent = size.label;
                    sizeDropdown.appendChild(option);
                });
            })
            .catch(error => console.error('Error fetching product sizes:', error));
    }

    function updateCartItemCount() {
        const myCartButton = document.getElementById('my-cart');
        const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
        myCartButton.textContent = `My Cart (${totalQuantity})`;
    }

    function addToCart() {

        const selectedOption = selectedSizeElement.options[selectedSizeElement.selectedIndex];
        if (selectedOption && selectedOption.value) {
            const existingItem = cartItems.find(item => item.size === selectedOption.value);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                const newItem = {
                    title: data.title,
                    size: selectedOption.value,
                    quantity: 1,
                    price: data.price,
                    imageURL: data.imageURL
                };
                cartItems.push(newItem);
            }

            displayCartItems();
            updateCartItemCount();
        } else {
            alert('Please select a size before adding to cart.');
        }

    }


    fetchProductSizes();
    addToCartButton.addEventListener('click', addToCart);

    function displayCartItems() {
        cartItemsList.innerHTML = '';

        cartItems.forEach(item => {
            const listItem = document.createElement('li');

            const imageElement = document.createElement('img');
            imageElement.src = item.imageURL;
            imageElement.alt = item.title;



            const infoWrapper = document.createElement('div');
            infoWrapper.classList.add('item-info-wrapper');


            const nameElement = document.createElement('span');
            nameElement.textContent = item.title;
            infoWrapper.appendChild(nameElement);

            infoWrapper.appendChild(document.createElement('br'));

            const quantityElement = document.createElement('span');
            quantityElement.textContent = `${item.quantity} x `;
            infoWrapper.appendChild(quantityElement);

            const priceElement = document.createElement('span');
            priceElement.textContent = `$${item.price}.00`;
            priceElement.classList.add('bold-price');
            infoWrapper.appendChild(priceElement);

            infoWrapper.appendChild(document.createElement('br'));

            const sizeElement = document.createElement('span');
            sizeElement.textContent = `Size: ${item.size}`;
            infoWrapper.appendChild(sizeElement);

            listItem.appendChild(imageElement);
            listItem.appendChild(infoWrapper);

            cartItemsList.appendChild(listItem);
        });
    }

    function toggleCartPopup() {
        const cartPopup = document.querySelector('.my-cart-popup');
        if (cartItems.length === 0) {
            cartPopup.classList.remove('show');
        } else {
            cartPopup.classList.toggle('show');
        }
    }

    const myCartButton = document.getElementById('my-cart');
    myCartButton.addEventListener('click', toggleCartPopup);




})


async function onPageLoad() {
    data = await fetchData();
    updateProductDetails(data);
}

window.onload = onPageLoad;