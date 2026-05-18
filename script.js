document.addEventListener('DOMContentLoaded', function () {
    // Event listeners for form submission
    const contactForm = document.getElementById('contactForm');
    const feedbackMessage = document.getElementById('feedback');
    const menuButton = document.getElementById('menuButton');
    const drawerMenu = document.getElementById('drawerMenu');
    const closeMenu = document.getElementById('closeMenu');
    const collapseMenuButton = document.getElementById('collapseMenu');

    // Event listener for the collapse button in the drawer menu
    if (collapseMenuButton) {
        collapseMenuButton.addEventListener('click', closeDrawerMenu);
    }

    // Event listener for the Menu button
    if (menuButton) {
        menuButton.addEventListener('click', toggleDrawerMenu);
    }

    // Event listener for closing the drawer menu
    if (closeMenu) {
        closeMenu.addEventListener('click', closeDrawerMenu);
    }

    // Function to toggle the drawer menu
    function toggleDrawerMenu() {
        // Toggle the 'menu-open' class on the body
        document.body.classList.toggle('menu-open');

        // Toggle the transform property of the drawer menu
        drawerMenu.style.transform = document.body.classList.contains('menu-open') ? "translateX(0)" : "translateX(100%)";
    }

    // Function to close the drawer menu
    function closeDrawerMenu() {
        // Remove the 'menu-open' class from the body
        document.body.classList.remove('menu-open');

        // Hide the drawer menu by translating it out of view
        drawerMenu.style.transform = "translateX(100%)";
    }

    // Event listener for form submission
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');

            if (nameInput.value.trim() === '' || emailInput.value.trim() === '' || messageInput.value.trim() === '') {
                feedbackMessage.innerText = 'Please fill out all the required fields.';
                styleFeedbackMessage(); // Apply styling to feedback message
            } else {
                const formData = new FormData(contactForm);
                fetch('https://formsubmit.co/f55b5af61d6f56f511e8fb7af2125618', {
                    method: 'POST',
                    body: formData,
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            feedbackMessage.innerText = 'Thank you for your message! I will get back to you shortly.';
                            styleFeedbackMessage(); // Apply styling to feedback message
                            contactForm.reset();
                        } else {
                            feedbackMessage.innerText = 'An error occurred while sending your message. Please try again later.';
                            styleFeedbackMessage(); // Apply styling to feedback message
                        }
                    })
                    .catch(error => {
                        feedbackMessage.innerText = 'An error occurred while sending your message. Please try again later.';
                        styleFeedbackMessage(); // Apply styling to feedback message
                    });
            }
        });
    }

    // Clear feedback message when interacting with the form fields
    const formFields = document.querySelectorAll('#contactForm input, #contactForm textarea');
    formFields.forEach(field => {
        field.addEventListener('input', clearFeedbackMessage);
    });

    // Clear feedback message when clicking the submit button
    const submitButton = document.getElementById('submitForm');
    if (submitButton) {
        submitButton.addEventListener('click', clearFeedbackMessage);
    }

    // Function to clear the feedback message
    function clearFeedbackMessage() {
        if (feedbackMessage) {
            feedbackMessage.innerText = ''; // Clear the content of the feedback message
            styleFeedbackMessage(); // Apply styling to feedback message
        }
    }

    // Function to apply styling to the feedback message
    function styleFeedbackMessage() {
        // You can customize the styling here
        feedbackMessage.style.backgroundColor = 'transparent';
        feedbackMessage.style.color = 'inherit';
    }

    // Scroll Indicator
    const scrollIndicator = document.getElementById('scrollIndicator');

    window.addEventListener('scroll', function () {
        // Get the height of the Hero Section
        const heroSectionHeight = document.querySelector('header').offsetHeight;

        // Calculate the scroll progress
        const scrollProgress = (window.scrollY / heroSectionHeight) * 100;

        // Update the visibility of the scroll indicator based on the scroll progress
        scrollIndicator.style.opacity = 1 - (scrollProgress / 100);
    });
});
