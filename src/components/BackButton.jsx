import { useNavigate } from 'react-router-dom';
// Wla nani gamita
const BackButton = ({ to = '/', className = '' }) => {
  const navigate = useNavigate();

  return (
    <button
      
      className={`${className}`}
      onClick={() => {
        navigate(to);
      }}
    >
      Back
    </button>
  );
};

export default BackButton;
