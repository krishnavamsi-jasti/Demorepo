import "./custom-login.scss";
import React, { useState, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import Form, {
  Item,
  Label,
  ButtonItem,
  ButtonOptions,
  RequiredRule,
} from "devextreme-react/form";
import LoadIndicator from "devextreme-react/load-indicator";
import notify from "devextreme/ui/notify";
import { useAuth } from "../../contexts/auth";

function CustomLogin() {
  let loginDetails = {};
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const formData = useRef({ companyname: "", userId: "", password: "" });

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const { companyname, userId, password } = formData.current;
      setLoading(true);

      const result = await signIn(companyname, userId, password);
      if (!result.isOk) {
        setLoading(false);
        notify(result.message, "error", 2000);
      }
    },
    [signIn]
  );

  const onCreateAccountClick = useCallback(() => {
    navigate("/create-account");
  }, [navigate]);

  const [inputs, setInputs] = useState({});

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
    loginDetails = { ...inputs };
    console.log(loginDetails);
  };

  const handleSubmit = async (inputs) => {
    console.log(inputs);

    const { companyname, userId, password } = inputs;
    console.log(inputs);
    setLoading(true);

    const result = await signIn(companyname, userId, password);
    if (!result.isOk) {
      setLoading(false);
      notify(result.message, "error", 2000);
    }
  };

  return (
    <div className="login-page-main">
      <div className="left-content">
        <div>
          <img
            style={{ height: "80px" }}
            alt=""
            src="https://i.imgur.com/Q4xinTB.png"
          />
        </div>
        <div className="atlantis-eclipse">
          <img src="https://i.imgur.com/LXwdcD6.png" alt="" />
        </div>
      </div>
      <div className="right-content">
        <div className="login-form-content">
          <div className="hello-text">Hello!</div>
          <div className="text-xl mb-4">Sign In to Get Started!</div>
          <div className="login-form-inputs">
            <div>
              <input
                className="login-input-control"
                type="text"
                placeholder="Company Name"
                name="companyname"
                value={inputs.companyname || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                className="login-input-control"
                type="text"
                placeholder="Username"
                name="userId"
                value={inputs.userId || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                className="login-input-control"
                type="password"
                placeholder="Password"
                name="password"
                value={inputs.password || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <button
                className="login-btn"
                onClick={() => handleSubmit(inputs)}
              >
                Login
              </button>
              {/* <div><p>Forgot password?</p> </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomLogin;
