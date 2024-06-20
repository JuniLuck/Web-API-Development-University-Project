import React from 'react';
import { Form, Input, Button } from 'antd';
import { status, json } from "../utilities/requestHandlers";

const onFinish = (values) => {
    console.log(values)
    values.access = "user";
    delete values.confirmPassword;
    const {...data} = values;
    console.log(data)
    fetch("https://analogcontact-handgabriel-3000.codio-box.uk/api/v1/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(status)
    .then(json)
    .then(data => {
        console.log(data);
        alert("Account created")
    })
    .catch(errorResponse => {
        alert(errorResponse);
    });
}

const onFinishFailed = (errorInfo) => {
    console.log(errorInfo);
  };

class Create extends React.Component{ 
    render() {
        return (
            <Form 
              name="create_account"
              labelCol={{span:10}}
              wrapperCol={{span:10}}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}>
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
                <Form.Item 
                  name="confirmPassword"
                  label="Confirm password"
                  hasFeedback
                  rules={[{
                      required: true,
                      message: "please confirm your password"
                    },    
                    ({ getFieldValue }) => ({
                        validator(rule, value) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject('Passwords do not match');
                        }
                    })]}>
                    <Input.Password />
                </Form.Item>
                <Form.Item 
                  name="email"
                  label="Email"
                  rules={[{
                      required: true,
                      message: "Email is required",
                    }]}>
                    <Input />
                </Form.Item>
                <Form.Item 
                  name="firstName"
                  label="First Name"
                  rules={[{
                      required: true,
                      message: "Your name is required",
                    }]}>
                    <Input />
                </Form.Item>
                <Form.Item 
                  name="lastName"
                  label="Last Name"
                  rules={[{
                      required: true,
                      message: "Your name is required",
                    }]}>
                    <Input />
                </Form.Item>
                <Form.Item wrapperCol={{offset:10}}>
                    <Button
                      type="primary"
                      htmlType="submit">
                          Create Account
                      </Button>
                </Form.Item>
            </Form>
          );
    }
}

export default Create;