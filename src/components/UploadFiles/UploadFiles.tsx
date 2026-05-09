import React, { useState } from "react";
import { uploadFiles } from "../../api/rest/filesService";

interface UploadFilesProps {
  albumName?: string;
  onUploadComplete?: () => void;
}

const UploadFiles: React.FC<UploadFilesProps> = ({ albumName, onUploadComplete }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [album, setAlbum] = useState(albumName ?? "");
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert("Selecione pelo menos um arquivo!");
      return;
    }

    if (!album.trim()) {
      alert("Informe o nome do álbum!");
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("files", file));
    formData.append("album", album.trim());

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
      alert("Upload realizado com sucesso!");

      localStorage.removeItem("albums");
      setSelectedFiles([]);
      setUploadProgress(null);
      if (!albumName) setAlbum("");
      onUploadComplete?.();
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Falha ao fazer upload dos arquivos.");
    }
  };

  return (
    <div style={{ margin: "0 auto" }} className="pb-5 max-w-[400px] text-center">
      <h2 className="p-5 text-xl">Upload de Vídeos</h2>
      {!albumName && (
        <input
          className="mb-3 w-full rounded border border-gray-300 px-3 py-2"
          type="text"
          placeholder="Nome do álbum"
          value={album}
          onChange={(e) => setAlbum(e.target.value)}
        />
      )}
      <input className="pb-2" type="file" onChange={handleFileChange} multiple />
      <button
        onClick={handleUpload}
        disabled={selectedFiles.length === 0 || !album.trim()}
        className="mt-2 rounded bg-green-600 px-4 py-2 text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Upload
      </button>
      {uploadProgress !== null && <p>Enviando: {uploadProgress}%</p>}
      {selectedFiles.length > 0 && (
        <div style={{ marginTop: "10px" }}>
          <h4>Arquivos selecionados:</h4>
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
