const multer = require('multer');
const path = require('path');

// ✅ កំណត់ទីតាំងរក្សាទុករូបភាព
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // ⚠️ ត្រូវមាន folder "uploads" នៅក្នុង project
  },
  filename: function (req, file, cb) {
    // បង្កើតឈ្មោះឯកសារតែមួយ
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// ✅ Filter តែរូបភាពប៉ុណ្ណោះ
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('រូបភាពត្រូវតែជា JPG, JPEG, PNG, GIF ឬ WEBP'));
  }
};

// ✅ កំណត់ទំហំឯកសារអតិបរមា (5MB)
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter
});

module.exports = upload;
