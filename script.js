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

    function addToCart() {

        const selectedOption = selectedSizeElement.options[selectedSizeElement.selectedIndex];
        if (selectedOption && selectedOption.value) {
            const existingItem = cartItems.find(item => item.size === selectedOption.value);

            if (existingItem) {
                // If the same size is already in the cart, increase the quantity
                existingItem.quantity += 1;
            } else {
                // If the size is not in the cart, add a new item
                const newItem = {
                    itemName: data.title, // You can set the actual item name here
                    size: selectedOption.value, // Use the text content of the selected option (size label)
                    quantity: 1 // Initialize the quantity to 1 for the new item
                };
                cartItems.push(newItem);
            }

            displayCartItems();
        } else {
            alert('Please select a size before adding to cart.');
        }

    }

    function displayCartItems() {
        cartItemsList.innerHTML = ''; // Clear the existing items

        cartItems.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = `${item.itemName} - Size: ${item.size} - Quantity: ${item.quantity}`;
            cartItemsList.appendChild(listItem);
        });
    }

    fetchProductSizes();
    addToCartButton.addEventListener('click', addToCart);
})


async function onPageLoad() {
    data = await fetchData();
    updateProductDetails(data);
}

window.onload = onPageLoad;