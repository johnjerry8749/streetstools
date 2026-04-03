import React from 'react'
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import Navbar from './Layout/Navbar';
import Footer from './Layout/footer';
import { useEffect, useState } from 'react';
import bannerimg from '../../assets/img/DigitalMarketing.png';
import WhatsAppChat from '../chatbots/Chatwidget';

const Home = () => {
const [siteName, setSiteName] = useState("");

useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL ?? '';
    fetch(`${apiUrl}/site-settings`)
      .then((response) => response.json())
      .then((data) => {
        setSiteName(data.sitename);
      });
  }, []);

  return (
    <div>
      <Navbar />
      
      {/* Hero Banner Section */}
      <div 
        className='py-5' 
        style={{
          backgroundImage: `url(${bannerimg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '400px',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backgroundBlendMode: 'overlay'
        }}
      >
        <Container>
          <Row className='align-items-center' style={{ minHeight: '400px' }}>
            <Col lg={8} className='mb-4 mb-lg-0'>
              <h3 className='display-4 fw-bold text-white'>
                Welcome to {siteName || "Site-Tools"} All-in-One Digital Store</h3>
              <p className='lead text-white mb-4 mt-4'>
                Your All-in-One Digital Marketplace - Buy verified social media accounts, create professional 
                consignment box videos, purchase premium websites, and ship products to loved ones worldwide. 
                Simplify your business operations, save costs, and grow your online presence effortlessly.
              </p>  
              <Button variant='primary' size='lg' className='me-3'>Get Started</Button>
            </Col>
          </Row>

          {/* Additional content sections can go here */}
          
        </Container>
      </div>

      {/* Social Evolution Section */}
      <div 
        className='py-5' 
        style={{
          backgroundColor: '#fafafaff',
          minHeight: '100vh',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container>
          {/* Main Heading */}
          <Row className='text-center mb-4'>
            <Col>
              <h1 className='display-3 fw-bold text-dark mt-5'>
                Transform Your Digital Presence<br />
                One Smart Purchase at a Time
              </h1>
              <p className='lead text-dark mt-3'>
                From ready-to-use social media accounts, consignment box video, low cost websites development,<br />
                we're your trusted partner for instant digital success and seamless business expansion.
              </p>
              
              <Button variant='dark' size='lg' className='mt-3 px-5 rounded-pill'>
                Explore Digital Products
              </Button>
            </Col>
          </Row>

          {/* Main Content Area */}
          <Row className='align-items-center mt-5' style={{ position: 'relative' }}>
            {/* Left Section - From Likes to Leads */}
            <Col md={3} className='mb-4'>
              <div 
                className='p-4 rounded-4 text-white'
                style={{
                  backgroundColor: '#000',
                  minHeight: '200px'
                }}
              >
                <h6 className='fw-bold '>
                  Website Creation<br />
                  Consignment Box-Video,<br />
                  Social Media Logs<br />
                  Other Digital Products <br />
                  Flash Any Crypto Wallet <br /> 
                  Graphics Design <br /> 
                  Video lips sync editing
                </h6>
              </div>
              
              {/* Check Reviews Button */}
              <div 
                className='d-flex align-items-center bg-dark text-white rounded-pill px-3 py-2 mt-3'
                style={{ width: 'fit-content' }}
              >
                <div className='d-flex me-2'>
                  <img 
                    src='https://i.pravatar.cc/40?img=1' 
                    alt='User 1'
                    className='rounded-circle'
                    style={{ width: '30px', height: '30px', marginLeft: '-5px', border: '2px solid #000' }}
                  />
                  <img 
                    src='https://i.pravatar.cc/40?img=2' 
                    alt='User 2'
                    className='rounded-circle'
                    style={{ width: '30px', height: '30px', marginLeft: '-10px', border: '2px solid #000' }}
                  />
                  <img 
                    src='https://i.pravatar.cc/40?img=3' 
                    alt='User 3'
                    className='rounded-circle'
                    style={{ width: '30px', height: '30px', marginLeft: '-10px', border: '2px solid #000' }}
                  />
                </div>
                <small>Check reviews</small> {/* Decorative Arrow */}
              </div>

              {/* Decorative Scribble */}
              <div className='mt-3'>
                <svg width='100' height='100' viewBox='0 0 100 100'>
                  <path d='M10,50 Q30,20 50,50 T90,50' stroke='#000' strokeWidth='2' fill='none' />
                  <path d='M10,60 Q30,30 50,60 T90,60' stroke='#000' strokeWidth='2' fill='none' />
                  <path d='M10,70 Q30,40 50,70 T90,70' stroke='#000' strokeWidth='2' fill='none' />
                </svg>
              </div>
            </Col>

            {/* Center Section - Image with Social Icons */}
            <Col md={6} className='text-center mb-4' style={{ position: 'relative' }}>
              {/* Boost Your Social Media Badge */}
              <div 
                className='position-absolute bg-dark text-white rounded-circle d-flex align-items-center justify-content-center'
                style={{
                  width: '120px',
                  height: '120px',
                  top: '10%',
                  left: '5%',
                  fontSize: '12px',
                  textAlign: 'center',
                  padding: '10px'
                }}
              >
                <div>
                  <div>Buy All</div>
                  <i className='bi bi-star'></i>
                  <div>Social Media Active Logs</div>
                </div>
              </div>

              {/* Social Media Icons */}
              <div 
                className='position-absolute bg-danger rounded-circle d-flex align-items-center justify-content-center'
                style={{ width: '50px', height: '50px', top: '15%', right: '20%' }}
              >
                <i className='bi bi-youtube text-white fs-5'></i>
              </div>

              <div 
                className='position-absolute bg-info rounded-circle d-flex align-items-center justify-content-center'
                style={{ width: '50px', height: '50px', top: '40%', right: '10%' }}
              >
                <i className='bi bi-twitter text-white fs-5'></i>
              </div>

              <div 
                className='position-absolute bg-primary rounded-circle d-flex align-items-center justify-content-center'
                style={{ width: '50px', height: '50px', bottom: '20%', left: '10%' }}
              >
                <i className='bi bi-facebook text-white fs-5'></i>
              </div>

              <div 
                className='position-absolute rounded-circle d-flex align-items-center justify-content-center'
                style={{ 
                  width: '50px', 
                  height: '50px', 
                  bottom: '30%', 
                  right: '15%',
                  background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)'
                }}
              >
                <i className='bi bi-instagram text-white fs-5'></i>
              </div>

              {/* Main Image */}
              <img 
                src='https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=600&fit=crop'
                alt='Social Media Management'
                className='img-fluid rounded-4'
                style={{ maxHeight: '500px', objectFit: 'cover' }}
              />
            </Col>

            {/* Right Section - Stats */}
            <Col md={3} className='mb-4'>
              {/* Clock Icon */}
              <div className='mb-4 text-end'>
                <i className='bi bi-clock' style={{ fontSize: '3rem' }}></i>
              </div>

              {/* Stats Card */}
              <div 
                className='p-4 rounded-4 text-white'
                style={{
                  backgroundColor: '#000',
                  minHeight: '300px'
                }}
              >
                <p className='mb-4'>
                  Thriving Brands, Thrilled Clients – Our Social Management in Action
                </p>
                
                <div className='mb-4'>
                  <div className='bg-secondary rounded' style={{ height: '8px', width: '80%' }}></div>
                  <h2 className='display-4 fw-bold mt-2'>500+</h2>
                  <p className='mb-0'>Active<br />Logs</p>
                </div>

                <div>
                  <h2 className='display-4 fw-bold'>800+</h2>
                  <div className='bg-secondary rounded' style={{ height: '8px', width: '80%' }}></div>
                  <p className='mt-2 mb-0'>Happy<br />Customers</p>
                </div>
              </div>

              {/* Decorative Element */}
              <div className='mt-3 text-end'>
                <svg width='150' height='80' viewBox='0 0 150 80'>
                  <ellipse cx='75' cy='40' rx='70' ry='35' stroke='#000' strokeWidth='2' fill='none' transform='rotate(-30 75 40)' />
                  <line x1='50' y1='20' x2='50' y2='40' stroke='#000' strokeWidth='2' />
                  <line x1='100' y1='40' x2='100' y2='60' stroke='#000' strokeWidth='2' />
                </svg>
              </div>
            </Col>
          </Row>
        </Container>

        {/* How to get Started */}
        <div className='w-100 text-center mt-5'>
          <Button variant='outline-dark' size='lg' className='px-5 rounded-pill'>
            How to Get Started
          </Button>
          <div className='mt-2'>
            <i className='bi bi-arrow-down-short fs-2'></i>
          </div>
        </div>
      </div>

      {/* Services Cards Section */}
      <div className='py-5 bg-white'>
        <Container>
          <Row className='g-4'>
            {/* Card 1 */}
            <Col md={6} lg={4}>
              <Card className='h-100 border-0 shadow-sm'>
                <Card.Body className='text-center p-4'>
                  <div className='mb-3'>
                    <i className='bi bi-people-fill text-primary' style={{ fontSize: '3rem' }}></i>
                  </div>
                  <Card.Title className='fw-bold mb-3'>Buy Social Media Accounts</Card.Title>
                  <Card.Text className='text-muted'>
                    Get verified and active social media accounts ready for immediate use. 
                    Build your online presence instantly with established profiles.
                  </Card.Text>
                  <Button variant='outline-primary' className='mt-3'>Browse Accounts</Button>
                </Card.Body>
              </Card>
            </Col>

            {/* Card 2 */}
            <Col md={6} lg={4}>
              <Card className='h-100 border-0 shadow-sm'>
                <Card.Body className='text-center p-4'>
                  <div className='mb-3'>
                    <i className='bi bi-laptop text-success' style={{ fontSize: '3rem' }}></i>
                  </div>
                  <Card.Title className='fw-bold mb-3'>Website Development</Card.Title>
                  <Card.Text className='text-muted'>
                    Professional, affordable website creation services. Get a stunning website 
                    built to your specifications at competitive prices.
                  </Card.Text>
                  <Button variant='outline-success' className='mt-3'>Get a Website</Button>
                </Card.Body>
              </Card>
            </Col>

            {/* Card 3 */}
            <Col md={6} lg={4}>
              <Card className='h-100 border-0 shadow-sm'>
                <Card.Body className='text-center p-4'>
                  <div className='mb-3'>
                    <i className='bi bi-camera-video-fill text-danger' style={{ fontSize: '3rem' }}></i>
                  </div>
                  <Card.Title className='fw-bold mb-3'>Consignment Box Videos</Card.Title>
                  <Card.Text className='text-muted'>
                    Professional video creation for your consignment boxes. 
                    Showcase your products with high-quality engaging videos.
                  </Card.Text>
                  <Button variant='outline-danger' className='mt-3'>Order Video</Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Second Row */}
          <Row className='g-4 mt-2'>
            {/* Card 4 */}
            <Col md={6} lg={4}>
              <Card className='h-100 border-0 shadow-sm'>
                <Card.Body className='text-center p-4'>
                  <div className='mb-3'>
                    <i className='bi bi-palette text-warning' style={{ fontSize: '3rem' }}></i>
                  </div>
                  <Card.Title className='fw-bold mb-3'>Professional Graphics Design</Card.Title>
                  <Card.Text className='text-muted'>
                    Custom logo design, branding, social media graphics, and visual content creation. 
                    Elevate your brand identity with stunning, professional design services.
                  </Card.Text>
                  <Button variant='outline-warning' className='mt-3'>Get Design</Button>
                </Card.Body>
              </Card>
            </Col>

            {/* Card 5 */}
            <Col md={6} lg={4}>
              <Card className='h-100 border-0 shadow-sm'>
                <Card.Body className='text-center p-4'>
                  <div className='mb-3'>
                    <i className='bi bi-wallet2 text-info' style={{ fontSize: '3rem' }}></i>
                  </div>
                  <Card.Title className='fw-bold mb-3'>Crypto Wallet Services</Card.Title>
                  <Card.Text className='text-muted'>
                    Flash crypto wallet services and digital currency solutions. 
                    Secure and instant cryptocurrency management tools.
                  </Card.Text>
                  <Button variant='outline-info' className='mt-3'>Explore Crypto</Button>
                </Card.Body>
              </Card>
            </Col>

            {/* Card 6 */}
            <Col md={6} lg={4}>
              <Card className='h-100 border-0 shadow-sm'>
                <Card.Body className='text-center p-4'>
                  <div className='mb-3'>
                    <i className='bi bi-bag-check-fill text-dark' style={{ fontSize: '3rem' }}></i>
                  </div>
                  <Card.Title className='fw-bold mb-3'>Digital Products</Card.Title>
                  <Card.Text className='text-muted'>
                    Browse our collection of digital products and services. 
                    Everything you need to grow your business in one place.
                  </Card.Text>
                  <Button variant='outline-dark' className='mt-3'>View Products</Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <WhatsAppChat /> {/* Whatsapp Livechat component*/}
      <Footer />
    </div>
  )
}

export default Home;
