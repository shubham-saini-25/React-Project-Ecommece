import React from 'react'

const About = () => {
    return (
        <div className='main'>
            <div className='image'>
                <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgF2suM5kFwk9AdFjesEr8EP1qcyUvah8G7w&usqp=CAU' />
            </div>
            <div className='about'>
                <h1>Hi, I am Shubham <span className='hand'>🤚</span></h1>
                <h3>I'm a Full Stack Developer.</h3>
                <div className='texts mt-3'>
                    <p><span style={{ fontSize: '1.3rem' }}>🇮🇳</span>&emsp;based in the Delhi, India</p>
                    <p><span style={{ fontSize: '1.3rem' }}>💻</span>&emsp;Full Stack Developer at Hestabit</p>
                    <p><span style={{ fontSize: '1.3rem' }}>📩</span>&emsp;shubhamsaini.hestabit@gmail.com</p>
                </div>
                <div className='socialIcons'>
                    <i className='fa fa-instagram fa-2x'></i>
                    <i className='fa fa-facebook-square fa-2x'></i>
                    <i className='fa fa-linkedin-square fa-2x'></i>
                    <i className='fa fa-github-square fa-2x'></i>
                </div>
                <br />
            </div>
        </div>
    );
}

export default About;