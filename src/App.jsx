import React, { useState } from "react";
import "./css/style.css";
import FileUpload from "./components/FileUpload";
import ProgressBar from "./components/ProgressBar";
import main from "./combined_task";

const App = () => {
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("Préparation de l'envoi...");
  const [loading, setLoading] = useState(false);

  const handleFileSubmit = async (file, companyName) => {
    setLoading(true);
    setProgress(0);
    setStatusMessage("Préparation de l'envoi...");

    try {
      // Call the pipeline function with update callbacks
      await main(file, companyName, setStatusMessage, setProgress);

      setStatusMessage("Terminé !");
    } catch (error) {
      console.error("Error in processing:", error);
      setStatusMessage("Une erreur s'est produite.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Analysez vos PDF facilement</h1>
      <p>
        Chargez un document PDF pour l analyser et générer automatiquement un
        rapport structuré.
        <br />
        <strong>Limite :</strong> 35 pages maximum par document.
      </p>
      <FileUpload onSubmit={handleFileSubmit} />
      {loading && <ProgressBar progress={progress} statusMessage={statusMessage} />}
    </div>
  );
};

export default App;
