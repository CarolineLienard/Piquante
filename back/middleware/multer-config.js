const multer = require('multer') //Import multer package

// Image stock location
const storage = multer.diskStorage({

  // Where the image gonna be stocked
  destination: (req, file, callback) => {

    // Send the image case to the backend
    callback(null, 'images');
  },
  // Create a name for the file
  filename: (req, file, callback) => {

    // Replace white space with underscore in the name
    let name = file.originalname.split(' ').join('_');

    // Add a date to the name to create a specific name file
    callback(null, name + Date.now()); 
  }
});

// Export with "single" method as it's a unique file
module.exports = multer({
  storage: storage
}).single('image');