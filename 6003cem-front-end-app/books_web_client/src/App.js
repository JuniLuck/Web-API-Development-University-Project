import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WebTitle from "./components/webtitle";
import Nav from "./components/nav";
import Account from "./components/accounts";
import Books from "./components/books";
import Book from "./components/book";
import Home from "./components/home";
import LogIn from "./components/login";
import Create from "./components/create";
import UserContext from "./contexts/user";
import { Content } from "antd/es/layout/layout";
import React from "react";



class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      user: {loggedIn: false}
    }
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  login(newUser){
    console.log(`state being set for ${newUser.username}`);
    console.log(newUser);
    newUser.loggedIn = true;
    this.setState({user:newUser});
  }

  logout(){
    console.log(`state being removed for ${this.state.user.username}`)
    this.setState({user: {loggedIn:false}})
  }

  render(){
    const context = {
      user: this.state.user,
      login: this.login,
      logout: this.logout
    }

    return (
      <UserContext.Provider value={context}>
        <Router>
          <div style={{textAlign: "center"}}>
            <WebTitle name="Front Page" />
          </div>
          <div style = {{position: "absolute", 
                        left: "50%",
                        transform: "translate(-50%)",
                        width: window.innerWidth}}>
            <Nav />
            <br/>
            <Content>
              <Routes>
                <Route path="/account" element={<Account/>} />
                <Route path="/account/login" element={<LogIn/>} />
                <Route path="/account/create" element={<Create/>} />
                <Route path="/books" element={<Books/>} />
                <Route path="/books/:id" element={<Book/>} />
                <Route path="/" element={<Home/>} />
              </Routes>
            </Content>

          </div>
        </Router>
      </UserContext.Provider>
    );
  }
}



export default App;
