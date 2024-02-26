function generateReceipt(event) {
    // stop default form submission until validations
    event.preventDefault();

    // get user input
    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var creditCardNumber = document.getElementById('creditCardNumber').value;
    
    // hide the first 12 digits of the users credit card
    var hiddenCreditCardNumber = 'xxxx-xxxx-xxxx-' + creditCardNumber.slice(-4);

    // get product information from user inputs
    var products = [];
    var productInputs = document.querySelectorAll('.productInput');
    var totalItemsPrice = 0; // create totalItemsPrice var to use for donation amount.
    var hasValidInput = false; // create and set var to false to ensure user input
    productInputs.forEach(function(input) {
        var productName = input.previousElementSibling.textContent.split('(')[0].trim();
        var productPrice = parseFloat(input.previousElementSibling.textContent.match(/\$\d+/)[0].replace('$', ''));
        var quantity = parseInt(input.value);
        if (!isNaN(quantity) && quantity > 0) {
            hasValidInput = true; // set the var to true is at least one item has a valid quantity
            var totalPrice = productPrice * quantity;
            products.push({ name: productName, quantity: quantity, price: productPrice, totalPrice: totalPrice });
            totalItemsPrice += totalPrice;
        }
    });

    // if atleast one item has not been bought or the inputs are invalid, prompt the user with an error message
    if (!hasValidInput) {
        // show the error message on the webpage to the user.
        var errorMessageElement = document.getElementById('errorMessage');
        errorMessageElement.innerHTML = 'Select at least one product | Use numbers for the quantities.';
        return; 
    }
    // if the user corrects their inputs, clear the error messages.
    document.getElementById('errorMessage').innerHTML = '';

    // create the var and use the Math.max to set it to the higher of $10 or %10 of the users total, this is were we use that totalItemsPrice var that was created earlier
    var donationAmount = Math.max(10, totalItemsPrice * 0.1);

    // create the content for the first portion of the receipt(user info)
    var receiptContent = '<h1>Thank you for your purchase</h1>';
    receiptContent += '<table class="info-table">';
    receiptContent += '<tr><td><strong>Name:</strong></td><td>' + name + '</td></tr>';
    receiptContent += '<tr><td><strong>Email:</strong></td><td>' + email + '</td></tr>';
    receiptContent += '<tr><td><strong>Credit Card Number:</strong></td><td>' + hiddenCreditCardNumber + '</td></tr>';
    receiptContent += '</table>';

    // create the content for the second portion of the receipt(purchase info)
    receiptContent += '<table class="receipt-table">';
    receiptContent += '<tr><th>Item</th><th>Quantity</th><th>Unit Price</th><th>Total Price</th></tr>';
    products.forEach(function(product) {
        receiptContent += '<tr>';
        receiptContent += '<td>' + product.name + '</td>';
        receiptContent += '<td>' + product.quantity + '</td>';
        receiptContent += '<td>$' + product.price.toFixed(2) + '</td>';
        receiptContent += '<td>$' + product.totalPrice.toFixed(2) + '</td>';
        receiptContent += '</tr>';
    });
    // add the donation row after all the product info rows have been created.
    receiptContent += '<tr><td>Donation</td><td colspan="2"></td><td>$' + donationAmount.toFixed(2) + '</td></tr>';
    // add the new total amount row after we have added our donation row.
    var totalAmount = totalItemsPrice + donationAmount;
    receiptContent += '<tr><td colspan="3"><strong>Total</strong></td><td><strong>$' + totalAmount.toFixed(2) + '</strong></td></tr>';
    receiptContent += '</table>';
    
    //use the window.open to pass the receiptConent as a URL param.
    var receiptWindow = window.open('receipt.html');
    receiptWindow.onload = function() {
        receiptWindow.document.getElementById('receiptContent').innerHTML = receiptContent;
    };

}
//use the addEventListener to check for form submission of our "checkout" button.
document.getElementById('userForm').addEventListener('submit', generateReceipt);
