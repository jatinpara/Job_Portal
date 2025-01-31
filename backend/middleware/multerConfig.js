import multer from 'multer';

// Set up file storage and file filter (if needed)
const storage = multer.diskStorage({
  filename:function(req,file,cb){
    cb(null, file.originalname);
  }
});

const upload = multer({storage:storage});

export default upload;
