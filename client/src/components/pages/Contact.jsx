import React, { useState, useEffect} from 'react'
import Navbar from './Layout/Navbar';
import Footer from './Layout/footer';
import WhatsAppChat from '../chatbots/Chatwidget';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('');
  const [siteEmail, setSiteEmail] = useState('');
  const [sitePhone, setSitePhone] = useState('');


    useEffect(() => {
      // Fetch site settings from the backend API
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      fetch(`${apiUrl}/site-settings`)
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 'success') {
            setSiteEmail(data.email);
            setSitePhone(data.phone);
          }
        })
        .catch((error) => console.error("Error fetching site name:", error));
    }, []);
  


  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('Sending...');
    // Placeholder: wire to API /contact when available
    setTimeout(() => {
      console.log('Contact form submitted', form);
      setStatus('Message sent — we will reply shortly.');
      setForm({ name: '', email: '', subject: '', message: '' });
    }, 800);
  };

  return (
    <div>
      <Navbar />

      <section className="contact-hero py-5" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-12 col-md-6 mb-4 mb-md-0">
              <h1 className="fw-bold">Get in Touch</h1>
              <p className="text-muted">Questions about buying social media logs, ordering consignment box videos, website creation or graphics? Send us a message — we typically reply within 24 hours.</p>

              <div className="mt-4">
                <h6>Contact Info</h6>
                <p className="mb-1"><strong>Email:</strong> {siteEmail || 'info@streetstools.example'}</p>
                <p className="mb-1"><strong>Phone:</strong> {sitePhone || '+123456789'}</p>
                <p className="mb-0"><strong>Hours:</strong> Mon–Fri, 9am–6pm (local time)</p>
              </div>
              <h5 className="fw-bold mt-5">For Quick Response Contact Us via Whatsapp button</h5>
            </div>
            <div className="col-12 col-md-6">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Send a Message</h5>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      <input name="name" value={form.name} onChange={handleChange} required className="form-control" />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input name="email" type="email" value={form.email} onChange={handleChange} required className="form-control" />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Subject</label>
                      <input name="subject" value={form.subject} onChange={handleChange} className="form-control" />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Message</label>
                      <textarea name="message" value={form.message} onChange={handleChange} required rows={5} className="form-control" />
                    </div>

                    <div className="d-grid">
                      <button type="submit" className="btn btn-primary">Send Message</button>
                    </div>
                  </form>

                  {status && <div className="alert alert-info mt-3" role="status">{status}</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <WhatsAppChat /> {/* Whatsapp Livechat component*/}
      <Footer />
    </div>
  )
}

export default Contact
