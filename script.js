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
    // const productSizeElement = document.querySelector('.product-size');
    const productImageElement = document.querySelector('.product-image');

    if (data) {
        productNameElement.textContent = data.title;
        productPriceElement.textContent = `$${data.price}.00`;
        productExplanationElement.textContent = data.description;
        // productSizeElement.textContent = `${data.sizeOptions.map(size => size.label).join(', ')}`;
        productImageElement.innerHTML = `<img src="${data.imageURL}" alt="${data.title}" />`;
    } else {
        productNameElement.textContent = 'Error fetching product details';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const sizeDropdown = document.getElementById('size');

    function fetchProductSizes() {
        fetch('https://3sb655pz3a.execute-api.ap-southeast-2.amazonaws.com/live/product')
            .then(response => response.json())
            .then(data => {
                const sizeOptions = data.sizeOptions;
                sizeOptions.forEach(size => {
                    const option = document.createElement('option');
                    option.value = size.id;
                    option.textContent = size.label;
                    sizeDropdown.appendChild(option);
                });
            })
            .catch(error => console.error('Error fetching product sizes:', error));
    }

    fetchProductSizes();
})

async function onPageLoad() {
    const data = await fetchData();
    updateProductDetails(data);
}

window.onload = onPageLoad;