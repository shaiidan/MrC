import React, {Component} from 'react'

class Footer extends Component{
    render(){
        return (
            <footer id="footer" class="footer-1">
    <div class="main-footer widgets-light typo-dark bg-light">
        <div class="container">
            <div class="row">
                <div class="col-xs-12 col-sm-6 col-md-3">
                    <div class="widget subscribe no-box">
                        <h5 class="widget-title">MrC<span></span></h5>
                        <p>All your medical records.</p>
                    </div>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-3">
                    <div class="widget no-box">
                        <h5 class="widget-title">Quick Links<span></span></h5>
                        <ul class="thumbnail-widget">
                            <li>
                                <div class="thumb-content"><a href="/">Home</a></div>	
                            </li>
                        </ul>
                    </div>
                </div>
    
                <div class="col-xs-12 col-sm-6 col-md-3">
                    <div class="widget no-box">
                        <h5 class="widget-title">Get Started<span></span></h5>
                        <p>Get easy access to your full medical history records.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
      
        <div class="footer-copyright">
            <div class="container">
                <div class="row">
                    <div class="col-md-12 text-center">
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