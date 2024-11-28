export const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

// File upload logic
export const handleFileUpload = (files) => {
  const basePath = `${process.env.HOST_URL}/public/uploads/`;
  if (!files || files.length === 0) throw new Error("No files uploaded");

  return files.map((file) => `${basePath}${file.filename}`);
};
