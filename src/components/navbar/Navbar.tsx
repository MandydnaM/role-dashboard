import person from '../../assets/person.svg'
import setting from '../../assets/setting.svg'
import message from '../../assets/message.svg'
import './navbar.scss';


function Navbar() {
    return (
        <div className='navbar'>
            <div className="logo">
                <span>Role Dashboard</span>
            </div>
            <div className="icons">
                <div className="user">
                    <img src={person} alt="" />
                    <span>admin</span>
                </div>
                <img src={setting} alt="" />
                <img src={message} alt="" className="icon" />
            </div>
        </div>
    )
}

export default Navbar;