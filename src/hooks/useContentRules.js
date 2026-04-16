import { useRules } from '../context/RulesContext';

export const useContentRules = () => {
  const { validateContent, contentRules, actions } = useRules();

  const validateUpload = (file) => {
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const validationData = {
      fileSize: file.size,
      fileType: fileExtension
    };

    return validateContent(validationData);
  };

  const isFileTypeAllowed = (fileType) => {
    return contentRules.allowed_file_types.includes(fileType.toLowerCase());
  };

  const isFileSizeValid = (fileSize) => {
    return fileSize <= contentRules.max_file_size;
  };

  const getMaxFileSizeFormatted = () => {
    const sizeInMB = contentRules.max_file_size / (1024 * 1024);
    return `${sizeInMB}MB`;
  };

  const getAllowedFileTypesString = () => {
    return contentRules.allowed_file_types.join(', ').toUpperCase();
  };

  const validateTextContent = (text) => {
    if (!contentRules.profanity_filter) {
      return { isValid: true, errors: [] };
    }

    const profanityList = ['damn', 'hell', 'crap'];
    const foundProfanity = profanityList.filter(word => 
      text.toLowerCase().includes(word.toLowerCase())
    );

    return {
      isValid: foundProfanity.length === 0,
      errors: foundProfanity.length > 0 
        ? [`Contains inappropriate language: ${foundProfanity.join(', ')}`]
        : []
    };
  };

  return {
    validateUpload,
    isFileTypeAllowed,
    isFileSizeValid,
    getMaxFileSizeFormatted,
    getAllowedFileTypesString,
    validateTextContent,
    contentRules
  };
};

