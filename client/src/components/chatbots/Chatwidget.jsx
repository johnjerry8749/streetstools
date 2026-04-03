import {useState, useEffect} from 'react';  

// Add this component in your Home.jsx or create a separate component
const WhatsAppChat = () => {
    const  [chatNumber, setchatNumber] = useState("")


       useEffect(() => {
           // Fetch site settings from the backend API
           const apiUrl = import.meta.env.VITE_API_URL ?? '';
           fetch(`${apiUrl}/site-settings`)
            .then((response) => response.json())
            .then((data) => {
            if (data.status === 'success') {
            setchatNumber(data.sitelivechat);
          
          
        }
      })
      .catch((error) => console.error("Error fetching site live chatNumber:", error));
  }, []);


  const message = "Hello! I'm interested in your services."; // Default message
  const whatsappUrl = `https://wa.me/${chatNumber}?text=${encodeURIComponent(message)}`;
  
  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#25D366',
        color: 'white',
        borderRadius: '50%',
        width: '60px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '30px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
        zIndex: 1000,
        textDecoration: 'none'
      }}
    >
      <i className='bi bi-whatsapp'></i>
    </a>
  );
};

export default WhatsAppChat;
