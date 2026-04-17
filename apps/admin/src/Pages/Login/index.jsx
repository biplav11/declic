import { Form, Input, Button, Alert } from "antd";
import "./index.scss";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

import { pb } from "src/Utility/pocketbase";

function Login() {
  const [loadings, setLoadings] = useState(false);
  const [alert, setAlert] = useState(false);
  let location = useLocation();
  let navigate = useNavigate();
  let from = location.state?.from?.pathname || "/";

  const onFinish = async ({ email, password }) => {
    setLoadings(true);
    try {
      let authData;
      try {
        authData = await pb.collection("admins").authWithPassword(email, password);
      } catch (collectionErr) {
        authData = await pb.admins.authWithPassword(email, password);
      }
      if (authData) {
        setLoadings(false);
        navigate(from, { replace: true });
      }
    } catch (err) {
      setAlert(true);
      setLoadings(false);
      setTimeout(() => {
        setAlert(false);
      }, 5000);
    }
  };

  const onFinishFailed = () => {
    setLoadings(true);
    setTimeout(() => {
      setLoadings(false);
    }, 1000);
  };

  if (pb.authStore.isValid) {
    return <Navigate to={from} />;
  }

  return (
    <div className="login-page">
      <div className="login-box">
        {/* <div className="illustration-wrapper">
                    <img
                        src="https://mixkit.imgix.net/art/preview/mixkit-left-handed-man-sitting-at-a-table-writing-in-a-notebook-27-original-large.png?q=80&auto=format%2Ccompress&h=700"
                        alt="Login"
                    />
                </div> */}
        <Form name="login-form" initialValues={{ remember: true }} onFinish={onFinish} onFinishFailed={onFinishFailed}>
          <p className="form-title">Welcome back</p>
          <p>Login to Dashboard</p>

          {alert && (
            <div className="alert-window">
              <Alert message="Your email and password is incorrect. Please check your credentials and try again" type="error" />
            </div>
          )}

          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
            ]}
          >
            <Input size="large" placeholder="Email Address" />
          </Form.Item>

          <Form.Item
            name="password"
            size="large"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button" loading={loadings}>
              LOGIN
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default Login;
