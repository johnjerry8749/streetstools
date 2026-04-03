import './css/footer.css'
import {useState, useEffect} from 'react';

const Footer = () => {

     const [siteName, setSiteName] = useState('mySite');

    useEffect(() => {
        const apiUrl = import.meta.env.VITE_API_URL ?? '';
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
    </footer>
  )
}

export default Footer
