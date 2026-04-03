import React from 'react'
import Navbar from './Layout/Navbar';
import Footer from './Layout/footer';
import WhatsAppChat from '../chatbots/Chatwidget';

 const Product = () => {
  return (
    <div>
        <Navbar />
        <div className='container-fluid p-5'>
            <h1>Welcome to the Product Page</h1>
        </div>
        <WhatsAppChat /> {/* Whatsapp Livechat component*/}
        <Footer />
    </div>
  )
}

export default Product;
