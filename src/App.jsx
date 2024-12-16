import { useState } from "react";
import "./css/style.css";
import FileUpload from "./components/FileUpload";
import ProgressBar from "./components/ProgressBar";
import main from "./combined_task";

const App = () => {
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("Préparation de l'envoi...");
  const [loading, setLoading] = useState(false);
  const [downloadLinks, setDownloadLinks] = useState(null);

  const handleFileSubmit = async (file, companyName, groupData) => {
    setLoading(true);
    setProgress(0);
    setStatusMessage("Préparation de l'envoi...");

    try {
      // Call the pipeline function with update callbacks
      const linksHtml = await main(file, companyName, groupData, setStatusMessage, setProgress);

      if (linksHtml) {
          setDownloadLinks(linksHtml); // Set the link HTML
      } else {
          setStatusMessage("Une erreur s'est produite.");
      }
      setStatusMessage("Terminé !");
    } catch (error) {
      console.error("Error in processing:", error);
      setStatusMessage("Une erreur s'est produite.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
      {downloadLinks && (
                  <div className="download-link-container">
                    {/* Render PDF Download Link */}
                    <a
                      href={downloadLinks.pdf.url}
                      className="download-link"
                      download={downloadLinks.pdf.name}
                    >
                      Télécharger le rapport : {downloadLinks.pdf.name}
                    </a>
                
                    {/* Render CSV Download Links */}
                    {downloadLinks.csvs.map((csv, index) => (
                      <a
                        key={index}
                        href={csv.url}
                        className="download-link"
                        download={csv.name}
                      >
                        Télécharger le CSV : {csv.name}
                      </a>
                    ))}
                    <a
                      href={downloadLinks.org.url}
                      className="download-link"
                      download={downloadLinks.org.name}
                    >
                      Télécharger le rapport : {downloadLinks.org.name}
                    </a>
                    
                </div>
              )
      }
    </>
    
  );
};

export default App;
