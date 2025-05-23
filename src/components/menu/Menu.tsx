import './menu.scss';
import { Link } from "react-router-dom";

const menu = [
    {
        id: 1,
        title: "Management",
        listItems: [
            {
                id: 1,
                title: "Permissions Management",
                url: "/",
                icon: "icon-home.svg",
            },
        ],
    }, {
        id: 2,
        title: "others",
        listItems: [
            {
                id: 1,
                title: "Others",
                url: "/lists",
                icon: "icon-personnel.svg",
            },
        ],
    },
];


function Menu() {
    return (
        <div className='menu'>
            {menu.map((item) => (
                <div className="item" key={item.id}>
                    <span className="title">{item.title}</span>
                    {item.listItems.map((listItem) => (
                        <Link to={listItem.url} className='listItem' key={listItem.id}>
                            <img src={listItem.icon} alt="" />
                            <span className="listItemTitle">{listItem.title}</span>
                        </Link>
                    ))}
                </div>
            ))}
        </div>
    )
}

export default Menu;