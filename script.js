const buttons = document.querySelectorAll(".product-card button");

buttons.forEach(function(button) {

    button.addEventListener("click", function() {

        alert("Thank you for your interest!");

    });

});
function orderOnWhatsApp(foodName, price) {

    const phoneNumber = "6369414605";

    const message =
        `Hello Veeranar Hotel,%0A%0A` +
        `I want to order:%0A` +
        `Food: ${foodName}%0A` +
        `Price: ₹${price}%0A%0A` +
        `Please confirm my order.`;

    const whatsappURL =
        `https://wa.me/${phoneNumber}?text=${message}`;

    window.open(whatsappURL, "_blank");
}