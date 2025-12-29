import React from 'react'
import Navbar from './layout/navbar'
import Footer from './layout/footer'
import './css/orders.css'

const Orders = () => {
  return (
    <div className="dashboard-container">
      <Navbar />
        <main className="dashboard-main">
            <div className="dashboard-content">
                <h4>Your Orders</h4>
                <p>Here is a list of your recent orders.</p>
               </div>
        </main>

      <Footer />
    </div>
  )
}

export default Orders
