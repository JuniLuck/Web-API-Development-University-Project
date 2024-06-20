import { Link } from "react-router-dom";
import { Menu, Dropdown } from "antd";
import UserContext from "../contexts/user";

const items = [{
    key: "1",
    label: (
      <Link to = "/account/login">Log In</Link>
    )
  },
  {
    key: "2",
    label: (
      <Link to = "/account/create">Create Account</Link>
    )
  },
  {
    key: "3",
    label: (
      <UserContext.Consumer>
        {({logout}) => (
          <>
            <Menu.Item onClick={logout} >
              <Link to = "/">Log out</Link>
            </Menu.Item>
          </>
        )}
      </UserContext.Consumer>
    )
  }
]

function Nav(props) {
    return (
      <>
        <div className="logo"/>
        <Menu theme="light" mode="horizontal" defaultSelectedKeys={['1']} style={{justifyContent: "center"}}>
          <Menu.Item key="1"><Link to = "/">Home</Link></Menu.Item>
          <Menu.Item key="2"><Link to = "/books">Books</Link></Menu.Item>
          <Menu.Item key="3">
            <Dropdown menu={{items}}>
              <Link to = "/account">Account</Link>
            </Dropdown>
          </Menu.Item>        
        </Menu>
      </>
    );
  }
  
  export default Nav;