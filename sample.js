// Set up multer for handling file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // Determine the destination folder based on the fieldname
     //  let destinationFolder = 'uploads/default/';
  
     //  if (file.fieldname === 'shop_image') {
     //    destinationFolder = 'uploads/shopPhotos/';
     //  } else if (file.fieldname === 'other_image') {
     //    destinationFolder = 'uploads/otherPhotos/';
     //  }
 
      let destinationFolder = 'uploads/shopPhotos/';
  
      cb(null, destinationFolder);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    },
  });
  
  const upload = multer({ storage: storage });
  
  // Define a function for shop registration
  const registerShop = async (req, res) => {
    try {
      const {
        name,
        email,
        password,
        contactNo,
        address,
        city,
        shop_type,
        rating,
        orders,
      } = req.body;
  
      // Check if a shop with the same email already exists
    const existingShop = await Shop.findOne({ email });
    if (existingShop) {
    //   return res.status(400).json({ message: 'Shop with this email already exists' });
    errorMessage = 'Shop with this email already exists';
          res.redirect('/api/shop/register');
    }

      const shop = new shopModel({
        name,
        email,
        password,
        contactNo,
        address,
        city,
        shop_type,
        shop_image: path.join('uploads/shopPhotos/', req.file.filename), // Save the image path
        rating,
        orders,
      });

      
  
      await shop.save();
      errorMessage = '.';
      res.status(201).json({ message: 'Shop registered successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  module.exports = {
    registerShop,
  };