// Toggle profile dropdown
document.getElementById('profileBtn').addEventListener('click', function () {
    let menu = document.getElementById('dropdownMenu');
    menu.style.display = (menu.style.display === 'flex') ? 'none' : 'flex';
    menu.style.flexDirection = 'column'; // make dropdown vertical
});

// Handle logout click
document.querySelector('#dropdownMenu a').addEventListener('click', function (e) {
    e.preventDefault(); // Stop default link behavior
    // Redirect to logout via PHP
    window.location.href = "main.php?logout=true";
});
