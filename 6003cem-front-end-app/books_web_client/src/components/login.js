import React from 'react';
import { Form, Input, Button } from 'antd';
import { status, json } from "../utilities/requestHandlers";
import UserContext from '../contexts/user';

class Login extends React.Component{ 
    static contextType = UserContext;
    constructor(props){
      super(props);
      this.onFinish = this.onFinish.bind(this);
      this.onFinishFailed = this.onFinishFailed.bind(this);
    }

    render() {
        return (
            <Form 
              name="log_in"
              labelCol={{span:10}}
              wrapperCol={{span:10}}
              onFinish={this.onFinish}
              onFinishFailed={this.onFinishFailed}>
                <Form.Item 
                  name="username"
                  label="Username"
                  rules={[{
                      required: true,
                      message: "Username is required",
                    }]}>
                    <Input />
                </Form.Item>
                <Form.Item 
                  name="password"
                  label="Password"
                  rules={[{
                      required: true,
                      message: "Password is required",
                    }]}>
                    <Input.Password />
                </Form.Item>
                <Form.Item wrapperCol={{offset:10}}>
                    <Button
                      type="primary"
                      htmlType="submit">
                          Login
                      </Button>
                </Form.Item>
            </Form>
          );
    }

    onFinish(values) {
      const {username, password} = values;
      console.log(values)
      fetch("https://analogcontact-handgabriel-3000.codio-box.uk/api/v1/login", {
          method: "GET",
          headers: {
              "Authorization":"Basic " + btoa(username+":"+password)
          }
      })
      .then(status)
      .then(json)
      .then(user => {
          console.log(`${user.username} logged in`);
          alert("logged in")
          this.context.login(user);
      })
      .catch(error => {
          alert(error);
      });
    }
  
    onFinishFailed(errorInfo) {
      console.log(errorInfo);
    };
}

export default Login;