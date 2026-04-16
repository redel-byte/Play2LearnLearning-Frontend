import React, { useState } from 'react';
import { useContentRules } from '../hooks/useContentRules';

const ContentValidator = ({ onValidationComplete, children }) => {
  const { validateUpload, validateTextContent, getMaxFileSizeFormatted, getAllowedFileTypesString } = useContentRules();
  const [validationErrors, setValidationErrors] = useState([]);
  const [isValid, setIsValid] = useState(true);

  const handleFileValidation = (file) => {
    const validation = validateUpload(file);
    setValidationErrors(validation.errors);
    setIsValid(validation.isValid);
    
    if (onValidationComplete) {
      onValidationComplete(validation);
    }
    
    return validation;
  };

  const handleTextValidation = (text) => {
    const validation = validateTextContent(text);
    setValidationErrors(validation.errors);
    setIsValid(validation.isValid);
    
    if (onValidationComplete) {
      onValidationComplete(validation);
    }
    
    return validation;
  };

  const clearValidation = () => {
    setValidationErrors([]);
    setIsValid(true);
  };

  if (children) {
    return children({
      validateFile: handleFileValidation,
      validateText: handleTextValidation,
      clearValidation,
      validationErrors,
      isValid,
      maxFileSize: getMaxFileSizeFormatted(),
      allowedFileTypes: getAllowedFileTypesString()
    });
  }

  return (
    <div className="content-validator">
      {validationErrors.length > 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="font-medium text-red-800">Validation Errors:</h4>
          <ul className="mt-2 text-sm text-red-600 list-disc list-inside">
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="text-sm text-gray-600">
        <p>Maximum file size: {getMaxFileSizeFormatted()}</p>
        <p>Allowed file types: {getAllowedFileTypesString()}</p>
      </div>
    </div>
  );
};

export default ContentValidator;
