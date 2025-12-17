import React from 'react'
import Navbar from './Layout/Navbar';
import Footer from './Layout/footer';
import WhatsAppChat from '../chatbots/Chatwidget';

const Services = () => {
  return (
    <div>
        <Navbar />
      <section className="services-hero py-5" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container">
          <div className="text-center mb-4">
            <h1 className="fw-bold">Our Services</h1>
            <p className="text-muted mx-auto" style={{ maxWidth: 800 }}>
              Buy verified social media account logs, order professional consignment
              box video editing, commission responsive website creation, and get
              eye-catching graphics design. Fast delivery, secure checkout, and
              dedicated support to help you grow online.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-12 col-md-6 col-lg-4">
              <div className="p-4 h-100 bg-white rounded shadow-sm d-flex flex-column">
                <div className="mb-3">
                  <i className="bi bi-people-fill text-primary" style={{ fontSize: '2rem' }}></i>
                </div>
                <h5>Buy Social Media Accounts</h5>
                <p className="text-muted flex-grow-1">Verified active social media logs (Instagram, Facebook, Twitter, YouTube) vetted for activity and safety — get instant reach for campaigns and launches.</p>
                <div>
                  <a href="/products/social-accounts" className="btn btn-primary w-100">Browse Accounts</a>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="p-4 h-100 bg-white rounded shadow-sm d-flex flex-column">
                <div className="mb-3">
                  <i className="bi bi-camera-video-fill text-danger" style={{ fontSize: '2rem' }}></i>
                </div>
                <h5>Consignment Box Video Editing</h5>
                <p className="text-muted flex-grow-1">Short-form, conversion-optimized consignment and product video editing for e-commerce and social campaigns — delivered ready for ads and listings.</p>
                <div>
                  <a href="/services/video-editing" className="btn btn-primary w-100">Order a Video</a>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="p-4 h-100 bg-white rounded shadow-sm d-flex flex-column">
                <div className="mb-3">
                  <i className="bi bi-laptop text-success" style={{ fontSize: '2rem' }}></i>
                </div>
                <h5>Website Creation & Graphics</h5>
                <p className="text-muted flex-grow-1">Responsive, SEO-friendly websites and professional graphics/branding. From landing pages to full e-commerce builds, we design to convert.</p>
                <div>
                  <a href="/services/web-design" className="btn btn-primary w-100">Get a Website</a>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="p-4 h-100 bg-white rounded shadow-sm d-flex flex-column">
                <div className="mb-3">
                  <i className="bi bi-palette text-warning" style={{ fontSize: '2rem' }}></i>
                </div>
                <h5>Graphics & Branding</h5>
                <p className="text-muted flex-grow-1">Logos, social graphics, product images and complete brand kits to elevate your visual identity across channels.</p>
                <div>
                  <a href="/services/graphics" className="btn btn-primary w-100">Get Design</a>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="p-4 h-100 bg-white rounded shadow-sm d-flex flex-column">
                <div className="mb-3">
                  <i className="bi bi-shield-lock text-info" style={{ fontSize: '2rem' }}></i>
                </div>
                <h5>Secure Payments & Delivery</h5>
                <p className="text-muted flex-grow-1">Safe checkout, encrypted transactions, and reliable delivery of digital goods with support and dispute handling.</p>
                <div>
                  <a href="/contact" className="btn btn-primary w-100">Contact Support</a>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="p-4 h-100 bg-white rounded shadow-sm d-flex flex-column">
                <div className="mb-3">
                  <i className="bi bi-rocket-takeoff text-dark" style={{ fontSize: '2rem' }}></i>
                </div>
                <h5>Fast Turnaround</h5>
                <p className="text-muted flex-grow-1">Choose expedited delivery options for urgent campaigns and launches — reliable timelines and clear communication.</p>
                <div>
                  <a href="/contact" className="btn btn-primary w-100">Request Quote</a>
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

export default Services
