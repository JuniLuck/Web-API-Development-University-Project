import React from "react";

import { status, json } from "../utilities/requestHandlers";

import ShoppingOutlined from "@ant-design/icons/ShoppingOutlined";
import ShoppingFilled from "@ant-design/icons/ShoppingFilled";
import SignatureOutlined from "@ant-design/icons/SignatureOutlined";
import SignatureFilled from "@ant-design/icons/SignatureFilled";
import UserContext from "../contexts/user";

function getIcon(type, status) {
    let Icon;
    if(status === "filled"){
        if(type === "cart"){
            Icon = ShoppingFilled;
        }
        else if(type === "wish"){
            Icon = SignatureFilled;
        }
    }
    if(status === "outlined"){
        if(type === "cart"){
            Icon = ShoppingOutlined;
        }
        else if(type === "wish"){
            Icon = SignatureOutlined;
        }
    }
    if(!Icon) {
        console.error(`Invalid icon type: ${type} ${status}`);
        Icon = ShoppingOutlined;
    }
    return Icon;
}

class PostIcon extends React.Component {
    static contextType = UserContext;
    constructor(props){
        super(props);
        this.state = {
            selected: props.selected,
            stateLink: props.stateLink
        };
        this.onClick = this.onClick.bind(this);
    }

    render(){
        const status = this.state.selected;
        const iconType = this.props.type;
        const Icon = getIcon(iconType, status);

        return(
            <span>
                <Icon 
                    onClick = {this.onClick} />
            </span>
        );
    };
    
    onClick() {
        let fetchMethod;
        if(this.state.selected === "filled"){fetchMethod = "DELETE"; this.setState({selected: "outlined"});}
        else{fetchMethod = "POST"; this.setState({selected: "filled"});}
        fetch(this.props.stateLink, {
            method: fetchMethod, 
            headers: {
                "Authorization": `Bearer ${this.context.user.token}`,
                accept: "application/json"
            }
        })
    };   
    
    componentDidMount() {
        if (this.context.user.loggedIn)
        {
            console.log("statelink: ",this.props.stateLink);
            console.log("token: ",this.context.user.token);
            fetch(this.props.stateLink, {
                headers: {
                    "Authorization": `Bearer ${this.context.user.token}`,
                    accept: "application/json"
                }
            })
            .then(status)
            .then(json)
            .then(iconState => {
                console.log(iconState);
                console.log(iconState.inList)
                const inList = iconState.inList;
                if(inList === true){
                    this.setState({ selected: "filled" });
                }
                else{
                    this.setState({ selected: "outlined" });
                }
                console.log(this.state.selected)
            })
            .catch(err => {
                console.log(`${this.props.type} ${this.props.selected} error for book. `,err);
            });
        }
        else 
        {
            this.setState({selected: "outlined"})
        }
    }
};


export default PostIcon;