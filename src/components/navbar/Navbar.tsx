import './navbar.scss'


function Navbar() {
    return (
        <div className='navbar'>
            <div className="logo">
                <span>Role Dashboard</span>
            </div>
            <div className="icons">
                <div className="user">
                    <img src="person.svg" alt="" />
                    <span>admin</span>
                </div>
                    <img src="setting.svg" alt="" />
                    <img src="message.svg" alt="" className="icon" />
            </div>
        </div>
    )
}

export default Navbar