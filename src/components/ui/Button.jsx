const Button = ({
  textContent,
  onClick,
  variant = 'primary',
  className = '',
  loading,
  disabled,
  type = 'button',
}) => {
  const baseClasses = "font-semibold py-2 px-4 rounded-lg transition duration-300 flex justify-self-center transform hover:scale-105";

  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none",
    success: "bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none",
    danger: "bg-red-600 hover:bg-red-700 text-white disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
  };

  const buttonClasses = `${baseClasses} ${variants[variant]} ${className}`;

  return (
    <button type={type} className={buttonClasses} onClick={onClick} disabled={loading || disabled}>
      {textContent}
    </button>
  );
};

export default Button;
