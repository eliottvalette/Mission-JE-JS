import PropTypes from "prop-types";

const ProgressBar = ({ progress, statusMessage }) => {
  return (
    <div id="loading">
      <div className="spinner"></div>
      <p id="statusMessage">{statusMessage}</p>
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
};

ProgressBar.propTypes = {
  progress: PropTypes.number.isRequired,
  statusMessage: PropTypes.string.isRequired,
};

export default ProgressBar;
