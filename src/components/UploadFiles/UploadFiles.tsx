import React, { useState } from "react";
import { uploadFiles } from "../../api/rest/filesService";

const UploadFiles = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null); // Track progress

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files)); // Convert FileList to Array
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert("Please select at least one file!");
      return;
    }
  
    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("files", file));
  
    try {
      const data = await uploadFiles(formData, (progressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        } else {
          console.warn("Total size of the file is not available.");
        }
      });

      console.log("Files uploaded successfully:", data);
      alert("Files uploaded successfully!");
      
      // Limpezas após o sucesso
      localStorage.clear();
      setSelectedFiles([]);
      setUploadProgress(null);
      
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Failed to upload files.");
    }
  };

  return (
    <div style={{margin: "0 auto" }} className='pb-5 max-w-[400px]'>
      <h2 className='p-5 text-xl'>Upload File</h2>
      <input className='pb-2' type="file" onChange={handleFileChange} multiple/>
      <button
        onClick={handleUpload}
        disabled={selectedFiles.length === 0}
        style={{
          marginTop: "10px",
          padding: "10px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: selectedFiles.length > 0 ? "pointer" : "not-allowed",
        }}
      >
        Upload
      </button>
      {uploadProgress !== null && (
        <p>Uploading: {uploadProgress}%</p> // Show upload progress
      )}
      {selectedFiles.length > 0 && (
        <div style={{ marginTop: "10px" }}>
          <h4>Selected Files:</h4>
          <ul>
            {selectedFiles.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UploadFiles;
