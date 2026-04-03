import React, { useEffect, useState } from 'react';
import Navbar from './Layout/Navbar';
import Footer from './Layout/footer';
import WhatsAppChat from '../chatbots/Chatwidget';
import aboutbanner from '../../assets/img/DigitalMarketing.png';

const About = () => {
  const [siteName, setSiteName] = useState("");

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL ?? '';
    fetch(`${apiUrl}/site-settings`)
      .then((response) => response.json())
      .then((data) => setSiteName(data.sitename))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const title = `${siteName ? siteName + ' - ' : ''}Buy Social Media Accounts & Digital Services`;
    document.title = title;

    const setMeta = (name, content) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.name = name;
        document.head.appendChild(el);
      }
      el.content = content;
    };

    setMeta('description', 'Buy verified social media account logs, order consignment box video editing, purchase professional website creation and graphics design services. Streetstools delivers fast, affordable digital products with secure checkout and reliable support.');
    setMeta('keywords', 'buy social media accounts, social media logs, consignment box video, video editing services, website creation, web development, graphics design, logo design, digital products');
  }, [siteName]);

  return (
    <div>
        <Navbar />
        {/* About banner */}
        <section
          className="about-banner"
          style={{
            backgroundImage: `url(${aboutbanner})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            minHeight: '100px',
            backgroundColor: 'rgba(30, 28, 28, 0.5)',
            backgroundBlendMode: 'overlay'
          }}
        >
          <div className="container text-center text-white py-5">
            <h1 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Buy Social Media Accounts & Digital Services</h1>
            <p className="lead" style={{ maxWidth: 900, margin: '0.5rem auto 1rem' }}>
              Purchase verified social media account logs, order professional consignment box video
              editing, get custom website creation, and hire expert graphics design. Fast delivery,
              secure transactions, and affordable packages to grow your online presence.
            </p>
          </div>
        </section>
        {/* End About banner */}
        {/* About content (SEO) */}
        <section className="about-content container py-5">
          <div className="row justify-content-center">
            <div className="col-12 col-md-10">
              <h2 className="mb-3">Who We Are</h2>
              <p className="lead">
                {siteName} is a trusted digital marketplace for businesses and creators.
                We specialize in verified social media account logs, consignment box video
                editing, website creation, and professional graphics design services.
                Our goal is to help you launch or scale online projects quickly and safely.
              </p>

              <h3 className="mt-4">What We Offer</h3>
              <p>
                Our suite of digital products and services includes ready-to-use social
                media logs, bespoke video editing for consignment packaging, affordable
                website development, and creative graphics — all backed by secure payment
                processing and delivery assurance.
              </p>
              <ul>
                <li><strong>Buy Social Media Accounts:</strong> Verified, active social media logs ready for immediate use.</li>
                <li><strong>Consignment Box Video Editing:</strong> Professional product and packaging videos optimized for conversions.</li>
                <li><strong>Website Creation:</strong> Responsive, SEO-friendly websites tailored to your brand and goals.</li>
                <li><strong>Graphics & Branding:</strong> Logos, social graphics, and marketing assets to elevate your presence.</li>
                <li><strong>Secure Payments & Delivery:</strong> Safe checkout and reliable delivery of digital goods.</li>
                <li><strong>Fast Turnaround & Support:</strong> Quick delivery options and responsive customer service.</li>
              </ul>

              <h3 className="mt-4">Why Choose {siteName}</h3>
              <p>
                We combine vetted digital products with experienced editors, developers,
                and designers to deliver dependable results. Whether you need social media
                logs, a compelling consignment-box video editing, a new website, or standout branding,
                {siteName} offers affordable packages, secure transactions, and ongoing support.
              </p>
            </div>
          </div>
        </section>
        {/* End About content (SEO) */}

     <WhatsAppChat /> {/* Whatsapp Livechat component*/}
     <Footer />
    </div>
  )
}

export default About
