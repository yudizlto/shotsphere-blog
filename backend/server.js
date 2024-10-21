const app = require("./app"); // Import the configured Express application
const { port } = require("./config/config"); // Load the port configuration variable

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
