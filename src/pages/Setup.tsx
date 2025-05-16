
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Setup = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the deployment page which now handles setup
    navigate('/deployment');
  }, [navigate]);
  
  return null;
};

export default Setup;
