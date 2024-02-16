document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    // Get the entered password
    const password = document.getElementById("password").value;

    // Load the password from the config file
    fetch("config.js")
      .then((response) => response.text())
      .then((config) => {
        // Parse the config file to extract the password
        const passwordFromConfig = JSON.parse(config).password;

        // Check if the entered password matches the stored password
        if (password === passwordFromConfig) {
          // Redirect to the main page or perform any other action
          window.location.href = "main.html"; // Change "main.html" to your main page filename
        } else {
          alert("Incorrect password. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error loading config file:", error);
        alert("Failed to load configuration. Please try again later.");
      });
  });
