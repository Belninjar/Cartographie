// Get image container elements
const imageContainers = document.querySelectorAll('.image-container');

// Get SVG container
const svgContainer = document.querySelector('.svg-container');

// Get the element to display hovered text
const hoveredText = document.getElementById('hovered-text');

// Get the day element
const dayElement = document.querySelector('.day');

// Function to create a curved line between two points
function createCurvedLine(x1, y1, x2, y2) {
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  const dx = x2 - x1;
  const dy = y2 - y1;
  const qx = (x1 + x2) / 2;
  const qy = (y1 + y2) / 2;
  
  // Adjust the curvature here
  const curveAmount = Math.min(50, Math.sqrt(dx * dx + dy * dy) * 1); // You can adjust the multiplier (0.3) to control the curvature
  
  // Calculate control point coordinates
  const qx1 = qx + curveAmount * dy / Math.sqrt(dx * dx + dy * dy);
  const qy1 = qy - curveAmount * dx / Math.sqrt(dx * dx + dy * dy);
  
  // Define the path
  const d = `M ${x1},${y1} Q ${qx1},${qy1} ${x2},${y2}`;
  
  // Set path attributes
  path.setAttribute("d", d);
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "white");
  
  // Append the path to the SVG container
  svgContainer.appendChild(path);
}
  
// Define connections between images
const connections = [
    { from: 0, to: 1 }, // Connect Image 1 to Image 2
    { from: 2, to: 0 }  // Connect Image 2 to Image 3
    // Add more connections as needed
  ];
  
 // Loop through connections to get their coordinates and create curved lines
connections.forEach(connection => {
  const fromContainer = imageContainers[connection.from];
  const toContainer = imageContainers[connection.to];
  const fromRect = fromContainer.getBoundingClientRect();
  const toRect = toContainer.getBoundingClientRect();
  const x1 = fromRect.left + fromRect.width / 2;
  const y1 = fromRect.top + fromRect.height / 2;
  const x2 = toRect.left + toRect.width / 2;
  const y2 = toRect.top + toRect.height / 2;
  createCurvedLine(x1, y1, x2, y2);
});
  
// JavaScript code to handle click event
document.querySelectorAll('.image-container').forEach(imageContainer => {
    imageContainer.addEventListener('click', () => {
      // Apply a CSS class to the body for the zoom-in effect
      document.body.classList.add('zoom-in');
      // After a delay, navigate to the target page
      setTimeout(() => {
        // Get the URL associated with the clicked image
        const imageUrl = imageContainer.dataset.pageUrl;
        // Navigate to the specified URL
        window.location.href = imageUrl;
      }, 800); // Adjust the delay as needed to match the transition duration
    });
  });
  
// JavaScript code for zoom-in effect on page load
document.addEventListener('DOMContentLoaded', function() {
    // Show the overlay to turn the left-image container black
    document.querySelector('.overlay_in').style.opacity = '0'; // Adjust opacity as needed
  });
  


// Get the current page URL
const currentPageUrl = window.location.pathname;

// Extract the filename from the URL
const filename = currentPageUrl.substring(currentPageUrl.lastIndexOf('/') + 1).replace('.html', '');

// Construct the CSV filename based on the current page
const csvFilename = filename + '_activite.csv';

// Fetch and parse the CSV file
fetch(`/Data/${csvFilename}`)
  .then(response => response.text())
  .then(data => {
    parseCSVData(data);
  })
  .catch(error => console.error('Error fetching the CSV file:', error));


// Display the text on the webpage
function displayText(data) {
const hoveredText = document.getElementById('hovered-text');
hoveredText.textContent = data[0].text; // Assuming the first row contains the text
}

// Parse the CSV data
function parseCSVData(csvData) {
  Papa.parse(csvData, {
      header: false,
      complete: function(results) {
          console.log("Parsed CSV data:", results.data); // Log the parsed CSV data
          // Call a function to associate each image URL with its corresponding text
          associateTextWithImages(results.data);
      }
  });
}

// Parse the CSV data
function parseCSVData2(csvData) {
  Papa.parse(csvData, {
      header: false,
      complete: function(results) {
          console.log("Parsed CSV data:", results.data); // Log the parsed CSV data
          // Call a function to handle the parsed data
          handleCSVData2(results.data);
      }
  });
}

// Associate each image URL with its corresponding text
function associateTextWithImages(data) {
  console.log("Associating text with images:", data); // Log the data array received
  // Assuming imageContainers is an array of image container elements
  imageContainers.forEach((container, index) => {
      // Get the text associated with the current image
      const text = data[index][1]; // Assuming the text is in the second column
      console.log("Text for image container", index, ":", text); // Log the text associated with each image
      // Set the data attribute for the text on the image container
      container.dataset.text = text;
  });
}

// Function to create and append a red dot element to the left-container
function createRedDot(x, y) {
  const redDot = document.createElement('div');
  redDot.classList.add('red-dot');
  redDot.style.position = 'absolute';
  redDot.style.width = '20px';
  redDot.style.height = '20px';
  redDot.style.backgroundColor = 'red';
  redDot.style.borderRadius = '50%';
  redDot.style.left = `${x}px`; // Set left position
  redDot.style.top = `${y}px`; // Set top position
  redDot.style.transform = 'translate(-50%, -50%)'; // Center the dot
  redDot.style.zIndex = '9999'; // Set a high z-index value
  redDot.style.opacity = '0'; // Initially hide the red dot
  redDot.style.background = "radial-gradient(circle, red, transparent)";
  document.querySelector('.left-container').appendChild(redDot);
  // Trigger a reflow to ensure smooth animation
  void redDot.offsetWidth;

  // Set opacity to 1 to animate the appearance
  redDot.style.opacity = '1';
}

// Add event listeners to each image container
imageContainers.forEach(container => {
  container.addEventListener('mouseenter', () => {
    // Get the specific text associated with the image container
    const specificText = container.dataset.text;
    // Update the text content in the right container
    updateHoveredTextWithFormatting(specificText)
    // Get the coordinates specified in the data attribute
    const coords = container.dataset.coords.split(',').map(coord => parseInt(coord));
    setTimeout(() => {
    // Create and append the red dot at the specified coordinates
    createRedDot(coords[0], coords[1]);
  }, 300);
    
  });

  container.addEventListener('mouseleave', () => {
    // Clear the text content when the mouse leaves the image container
    updateHoveredTextWithFormatting('');
    // Remove the red dot when mouse leaves the image container
    const redDot = document.querySelector('.red-dot');
    // Remove any existing red dots when mouse leaves the image container
    document.querySelectorAll('.red-dot').forEach(dot => dot.remove());
  });
});

// Function to update the text content in the right container with formatting
function updateHoveredTextWithFormatting(text) {
  const hoveredText = document.getElementById('hovered-text');
  // Replace special characters with HTML markup for formatting
  const formattedText = text
      // Replace underscores with <u> tags for underline
      .replace(/_([^_]+)_/g, '<u>$1</u>')
      // Replace asterisks with <strong> tags for bold
      .replace(/\*([^\*]+)\*/g, '<strong>$1</strong>')
      // Replace newline characters with <br> tags for line breaks
      .replace(/\\n/g, '<br>');
  hoveredText.innerHTML = formattedText;
}


// Fetch and parse the CSV file
fetch('/Data/Transverse.csv', { 
headers: { 'Content-Type': 'text/csv; charset=iso-8859-1' } 
})
  .then(response => response.text())
  .then(data => {
      parseCSVData2(data);
  })
  .catch(error => console.error('Error fetching the CSV file:', error));



// Function to handle the parsed CSV data
function handleCSVData2(data) {
  // Add event listeners to SVG paths representing the lines
  document.querySelectorAll('.svg-container path').forEach((path, index) => {
      path.addEventListener('mouseenter', () => {
          const text = data[index][2]; // Get the text associated with the current line
          updateHoveredTextWithFormatting(text); // Update the text in the right container
      });

      path.addEventListener('mouseleave', () => {
        updateHoveredTextWithFormatting(''); // Clear the text in the right container when mouse leaves the line
      });
  });
}



// Function to update the background position of the planet texture
function updateBackgroundPosition(angle) {
  const newPosition = (angle / 360) * 200; // Convert angle to background position
  dayElement.style.backgroundPosition = `${newPosition}% 0`; // Update background position
}

// Add event listeners to each image container
imageContainers.forEach(container => {
  container.addEventListener('mouseenter', () => {
    const angle = parseInt(container.dataset.angle) || 0; // Default to 0 if no angle is provided
    updateBackgroundPosition(angle);
  });
});

