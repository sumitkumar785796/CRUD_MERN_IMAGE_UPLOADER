const RegForm = require("../model/Registration");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
// Define the multer code for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/upload")); // upload directory path
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname); // save the file name
  },
});

// Middleware for handling file uploads
const upload = multer({
  storage: storage,
}).single("profile");
//end code multer

//Page not found route
const PageNotFound = async (req, res) => {
  try {
    res.status(200).render("page/pagenot", { title: "Page is not found" });
  } catch (error) {
    res.status(500).send("Page is not created");
  }
};
//Main page route
const MainPage = async (req, res) => {
  try {
    res.sendFile(
      path.resolve(__dirname, "..", "client", "build", "index.html")
    );
  } catch (error) {
    console.error(error);
  }
};
//Insert page route
const InsertPage = async (req, res) => {
  try {
    res.status(200).render("page/insertForm", { title: "Insert Page" });
  } catch (error) {
    res.status(500).send("Page is not created");
  }
};
// Handle image upload and form submission
const handleImageUploadAndInsert = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        console.error(err); // Log the error to the console for debugging
        return res.status(500).json({
          message: `Error uploading file. ${err.message}`,
          type: "danger",
        });
      }

      const { fname, email } = req.body;
      const imageFileName = req.file.filename;

      if (!fname || !email) {
        return res.status(400).json({
          message: "Please fill in all data... All fields are required!!!",
          type: "danger",
        });
      }

      try {
        const emailExist = await RegForm.findOne({ email });
        if (emailExist) {
          return res
            .status(400)
            .json({ message: "Email already exists", type: "danger" });
        }

        const user = new RegForm({
          profile: imageFileName,
          fname,
          email,
        });

        const insertData = await user.save();
        res.status(201).json({ message: insertData });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          message: `Error creating user record. ${error.message}`,
          type: "danger",
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", type: "danger" });
  }
};
//end insert code
// view page route
const ViewPage = async (req, res) => {
  try {
    const view = await RegForm.find();
    res.status(200).json({ message: view });
  } catch (error) {
    res.status(500).send("Page is not created");
  }
};
//end view code
//Update page route
const UpdatePage = async (req, res) => {
  try {
    const { id } = req.params;
    const reg = await RegForm.findById(id);
    res.status(200).json({ message: reg });
  } catch (error) {
    res.status(500).send("Page is not created");
  }
};
//Update Handle image upload and form submission
const handleImageUploadAndUpdate = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          message: `Error uploading file. ${err.message}`,
          type: "danger",
        });
      }

      try {
        const { id } = req.params;
        let newImage = "";

        // Check if a new file is uploaded
        if (req.file) {
          newImage = req.file.filename;
          // Delete the old image file
          if (req.body.deleteOldImage === "true") {
            console.log("Before deleting old image");
            try {
              fs.unlinkSync(
                path.join(__dirname, "../public/upload", req.body.oldImage)
              );
              console.log("Old image deleted successfully");
            } catch (error) {
              console.error(error);
              return res
                .status(500)
                .json({
                  message: `Error deleting old image: ${error.message}`,
                  type: "danger",
                });
            }
          }
        } else if (req.body.deleteOldImage === "true") {
          // No new file uploaded, but user wants to delete the existing image
          newImage = null;
          console.log("Before deleting old image");
          try {
            fs.unlinkSync(
              path.join(__dirname, "../public/upload", req.body.oldImage)
            );
            console.log("Old image deleted successfully");
          } catch (error) {
            console.error(error);
            return res
              .status(500)
              .json({
                message: `Error deleting old image: ${error.message}`,
                type: "danger",
              });
          }
        } else {
          // No new file uploaded, use the existing image
          newImage = req.body.oldImage;
        }

        const { fname, email } = req.body;
        if (!fname || !email) {
          return res.status(400).json({
            message: "Please fill in all data. All fields are required!!!",
            type: "danger",
          });
        }

        // Find the user by ID and update the fields
        const user = await RegForm.findByIdAndUpdate(
          id,
          {
            fname,
            email,
            profile: newImage,
          },
          { new: true }
        );

        if (!user) {
          return res.status(400).json({ message: "User is not found" });
        }

        res.status(200).json({ message: user });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          message: `Error updating user record. ${error.message}`,
          type: "danger",
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", type: "danger" });
  }
};

// Delete record by ID
const deleteRecord = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the record by ID and remove it
    const deletedRecord = await RegForm.findByIdAndDelete(id);

    if (!deletedRecord) {
      return res
        .status(404)
        .json({ message: "Record not found", type: "danger" });
    }

    // Delete the image file from the folder
    const imagePath = path.join(
      __dirname,
      "../public/upload",
      deletedRecord.profile
    );

    // Check if the file exists before attempting to delete it
    if (fs.existsSync(imagePath)) {
      // Use the promise version of fs.unlink to avoid the callback issue
      await fs.promises.unlink(imagePath);

      // Log a message after attempting to delete
      console.log("Image deleted successfully.");
    } else {
      console.error(`Error: File not found at path ${imagePath}`);
    }

    // If the record is successfully deleted, redirect or send a response
    // res.redirect('/view');
    // or
    res
      .status(200)
      .json({ message: "Record deleted successfully", type: "success" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: `Error deleting record. ${error.message}`,
        type: "danger",
      });
  }
};

module.exports = {
  PageNotFound,
  MainPage,
  InsertPage,
  handleImageUploadAndInsert,
  UpdatePage,
  handleImageUploadAndUpdate,
  ViewPage,
  deleteRecord,
};
