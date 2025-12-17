import './footer.css';
import {useState, useEffect} from 'react';
import WhatsAppChat from '../../chatbots/Chatwidget';
const Footer = () => {
    const [siteName, setSiteName] = useState('mySite');

    useEffect(() => {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        fetch(`${apiUrl}/site-settings`)
          .then((response) => response.json())
            .then((data) => {
                if (data.status === 'success') {
                    setSiteName(data.sitename);
                }   
            })
          .catch((error) => console.error("Error fetching site name:", error));
      }, []);

  return (
    <footer className="dashboard-footer">
      <div className="footer-card">
        <p>&copy; {new Date().getFullYear()} {siteName}. All rights reserved.</p>
      </div>
      <WhatsAppChat />
    </footer>
  );
};

export default Footer;
