const Switch = ({ enabled, setEnabled }) => {
  const handleClick = event => {
    event.preventDefault(); // Impede a atualização da página
    setEnabled(!enabled);
  };

  return (
    <button
      onClick={handleClick}
      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ${
        enabled ? 'bg-primaryGreen' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block w-6 h-6 transform rounded-full transition-transform duration-200 ${
          enabled ? 'translate-x-5 bg-white' : 'translate-x-0 bg-white'
        }`}
      />
    </button>
  );
};

export default Switch;
