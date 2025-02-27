// import multer from "multer";

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, './public/temp')
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.originalname + '-' + Date.now())
//     }
//   })
  
// export const upload = multer({ storage: storage })
// import multer from "multer";
import multer from "multer";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('Saving to:', './public/temp');
    cb(null, '/uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});



export const upload = multer({ storage: storage })


// - Rashid Khalique (Mern Stack Modification Project Multer middlewear) 
// - All are Modified of Midddlewear Folder




// - Rashid Khalique (Mern Stack Modification Project Multer middlewear) 
// - All are Modified of Midddlewear Folder