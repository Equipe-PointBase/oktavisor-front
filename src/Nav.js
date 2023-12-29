import React, {Component} from 'react';
//import { Link } from 'react-router-dom';
import LogoutButton from './logout-button';

class Nav extends Component {

    render() {
        return(
                <nav className="navbar navbar-expand-lg mb-3">
                <div className="container-fluid">
                    <img className='nav-logo' src="https://assets-global.website-files.com/64c21e1b39523790ed388d98/64c238ee5be66bd1bd0f6d6d_logo_transparent.png" alt='Oktavisor'/>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    </ul>
                    <form className="d-flex" role="search">
                    </form>
                    <LogoutButton />
                    </div>
                </div>
                </nav>            
        );
    }

}

export default Nav