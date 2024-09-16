const path = require("path");
const multer = require("multer");
const fs = require("fs");

// for vercal development process from here
const uploadsDir = path.join("/tmp", "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
} // to here

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const fileUpload = multer({ storage: storage });

module.exports = fileUpload;
