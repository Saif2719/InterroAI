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
document.addEventListener('DOMContentLoaded', function() {
    const tags = document.querySelectorAll('.role-tag,.custom');
    
    tags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 5px 15px rgba(79, 70, 229, 0.2)';
        });
        
        tag.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });
});