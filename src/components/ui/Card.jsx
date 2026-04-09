import React from 'react';
import Button from './Button';

const Card = ({ 
  title, 
  subtitle, 
  image, 
  imageAlt, 
  difficulty, 
  buttonText = "Start Quiz", 
  onButtonClick, 
  variant = 'default',
  children,
  className = ''
}) => {
  const getDifficultyColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCardClasses = () => {
    const baseClasses = "bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300";
    return `${baseClasses} ${className}`;
  };

  return (
    <div className={getCardClasses()}>
      <div className="p-6">
        {image && (
          <div className="flex justify-center mb-4">
            <img 
              src={image} 
              alt={imageAlt || title} 
              className="h-24 w-24 object-contain" 
            />
          </div>
        )}
        
        <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
          {title}
        </h3>
        
        {subtitle && (
          <p className="text-center text-gray-600 mb-4">
            {subtitle}
          </p>
        )}
        
        {difficulty && (
          <p className="text-center text-gray-600 mb-4">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(difficulty)}`}>
              Difficulty: {difficulty}
            </span>
          </p>
        )}
        
        {children}
        
        {buttonText && onButtonClick && (
          <Button 
            onClick={onButtonClick} 
            textContent={buttonText} 
            variant='primary' 
          />
        )}
      </div>
    </div>
  );
};

export default Card;