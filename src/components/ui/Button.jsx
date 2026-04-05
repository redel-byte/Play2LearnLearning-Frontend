const Button = ({ textContent, onClick, variant = 'primary', className = '', loading }) => {
  const baseClasses = "font-semibold py-2 px-4 rounded-lg transition duration-300 flex justify-self-center transform hover:scale-105";

  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white",
    success: "bg-green-600 hover:bg-green-700 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white"
  };

  const buttonClasses = `${baseClasses} ${variants[variant]} ${className}`;

  return (
    <button className={buttonClasses} onClick={onClick} disabled={loading}>
      {textContent}
    </button>
  );
};

export default Button;