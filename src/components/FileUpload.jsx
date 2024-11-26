import { useState } from "react";
import PropTypes from "prop-types";

const FileUpload = ({ onSubmit }) => {
  const [file, setFile] = useState(null);
  const [companyName, setCompanyName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file && companyName) {
      onSubmit(file, companyName);
    } else {
      alert("Veuillez sélectionner un fichier et entrer un nom d'entreprise.");
    }
  };

  return (
    <form id="uploadForm" onSubmit={handleSubmit} className="file-upload-form">
      <label htmlFor="fileUpload" id="fileLabel" className="file-upload-button">
        Sélectionner un fichier <span id="fileIcon">📄</span>
      </label>
      <input
        type="file"
        id="fileUpload"
        name="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
        required
      />
      <div className="companyname-input">
        <label htmlFor="companyName" className="text-label">
          Nom de l entreprise :
        </label>
        <input
          type="text"
          id="companyName"
          name="companyName"
          placeholder="Entrez le nom de l'entreprise"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="submit-button">
        Générer un compte rendu structuré
      </button>
    </form>
  );
};

FileUpload.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default FileUpload;
