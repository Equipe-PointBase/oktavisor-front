import React, {Component} from 'react';
//import { Link } from 'react-router-dom';
import LogoutButton from './logout-button';

class Nav extends Component {

    render() {
        return(
                <nav className="navbar navbar-expand-lg mb-3">
                <div className="container-fluid">
                    <img className='nav-logo' src="https://pointbase.fr/Applications/PBWeb/assets/img/img-pb/logo_transparent_banner.png" alt='Oktavisor'/>
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