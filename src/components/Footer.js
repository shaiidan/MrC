import React, {Component} from 'react'
import './Footer.css'

class Footer extends Component{
    render(){
        return (
            <footer id="footer" className="footer-1">
    <div className="main-footer widgets-light typo-dark bg-light">
        <div className="container">
            <div className="row">
                <div className="col-xs-12 col-sm-6 col-md-3">
                    <div className="widget subscribe no-box">
                        <h5 className="widget-title">MrC<span></span></h5>
                        <p>All your medical records.</p>
                    </div>
                </div>
                <div className="col-xs-12 col-sm-6 col-md-3">
                    <div className="widget no-box">
                        <h5 className="widget-title">Quick Links<span></span></h5>
                        <ul className="thumbnail-widget">
                            <li>
                                <div className="thumb-content"><a href="/">Home</a></div>	
                            </li>
                        </ul>
                    </div>
                </div>
    
                <div className="col-xs-12 col-sm-6 col-md-3">
                    <div className="widget no-box">
                        <h5 className="widget-title">Get Started<span></span></h5>
                        <p>Get easy access to your full medical history records.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
      
        <div className="footer-copyright">
            <div className="container">
                <div className="row">
                    <div className="col-md-12 text-center">
                        <p>Copyright MrC © 2021. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </div>
</footer>

        );
    }
}
export default Footer;