import { SiRedux, SiPostgresql, SiExpress, SiSequelize } from "react-icons/si";
import "./AboutLinks.css";

function AboutLinks() {
    return (
        <div className='footer'>
            <div className='footer-heading'>
                <div className="dev-heading" >Developer
                    <div className='devs'>
                        <div className="aDev">
                            <div className="devLogos">
                                <a title="LinkedIn" href='https://www.linkedin.com/in/landon-hurst-863b87295//' target="_blank" rel="noopener noreferrer">
                                    <span className="icons">
                                        <i className="fa-brands fa-linkedin fa-lg"></i>
                                    </span>
                                </a>
                                <a title="GitHub" href="https://github.com/LANDNh" target="_blank" rel="noopener noreferrer">
                                    <span className="icons">
                                        <i className="fa-brands fa-github fa-lg"></i>
                                    </span>
                                </a>
                            </div>
                            <span className="names">Landon Hurst</span>
                        </div>
                    </div>
                </div>
                <div className='dev-heading'>Technologies
                    <div className='techs'>
                        <div className='backend'>
                            <a title="JavaScript" href='https://developer.mozilla.org/en-US/docs/Web/JavaScript' target="_blank" rel="noopener noreferrer">
                                <i className="fa-brands fa-js fa-lg"></i>
                            </a>
                            <a title="Express.js" href='https://expressjs.com/en/4x/api.html' target="_blank" rel="noopener noreferrer">
                                <SiExpress />
                            </a>
                            <a title="Sequelize" href='https://sequelize.org/docs/v6/' target="_blank" rel="noopener noreferrer">
                                <SiSequelize />
                            </a>
                            <a title="PostgreSQL" className="postgres" href='https://www.postgresql.org/docs/' target="_blank" rel="noopener noreferrer">
                                <SiPostgresql />
                            </a>
                            <a title="React" href='https://react.dev/' target="_blank" rel="noopener noreferrer">
                                <i className="fa-brands fa-react fa-lg"></i>
                            </a>
                            <a title="Redux" href='https://redux.js.org/' target="_blank" rel="noopener noreferrer">
                                <SiRedux />
                            </a>
                            <a title="HTML5" href='https://developer.mozilla.org/en-US/docs/Web/HTML' target="_blank" rel="noopener noreferrer">
                                <i className="fa-brands fa-html5 fa-lg"></i>
                            </a>
                            <a title="CSS3" href='https://www.w3.org/Style/CSS/Overview.en.html' target="_blank" rel="noopener noreferrer">
                                <i className="fa-brands fa-css3-alt fa-lg"></i>
                            </a>
                        </div>
                    </div>
                </div>
                <div className='dev-heading'>Docs
                    <div className='docs'>
                        <a className="docs-links" href='https://github.com/LANDNh/LifeSkill' target="_blank" rel="noopener noreferrer">
                            Repository
                        </a>
                        <a className="docs-links" href='https://github.com/LANDNh/LifeSkill/wiki' target="_blank" rel="noopener noreferrer">
                            Wiki
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AboutLinks;
