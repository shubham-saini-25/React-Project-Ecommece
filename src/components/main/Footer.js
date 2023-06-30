import React from 'react';

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <div className='footer'>
            <div className='footerContent'>
                <h2>E-Commerce</h2>
                <p className='footerText mt-4'>
                    We are dedicated to providing you with the best shopping experience possible.
                    Explore our wide range of high-quality products, carefully curated to meet your needs.
                    At our company, we prioritize customer satisfaction and strive to exceed your expectations.
                    Our mission is to deliver exceptional services, ensuring a seamless shopping journey for you.
                    Shop with confidence knowing that we prioritize product quality and only offer trusted brands.
                    From fashion to electronics, home decor to wellness products, we have something for everyone.
                    If you have any questions, feedback, our friendly customer support team is here to help.
                    Contact us through the provided channels, and we'll be more than happy to assist you.
                    <br /><br />Thank you for choosing our e-commerce website. Happy shopping!
                </p>
                <div className='links mt-4'>
                    <i className='fa fa-instagram  fa-2x'></i>
                    <i className='fa fa-facebook fa-2x'></i>
                    <i className='fa fa-whatsapp fa-2x'></i>
                    <i className='fa fa-twitter fa-2x'></i>
                    <i className='fa fa-youtube-play fa-2x'></i>
                </div>
            </div>
            <footer className='fs-5 text-center' style={{ backgroundColor: 'gray', height: '30px' }}>
                {`Copyright © ${year} | Shubham Saini`}
            </footer>
        </div>
    );
}

export default Footer;