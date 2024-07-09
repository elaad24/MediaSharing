import { useState } from "react";
import SocialSignup from "../../components/SocialSignup";
import Input from "../../components/common/Input";
import { login, test } from "../../services/authApi";
import { userLoginForm } from "../../interfaces/user";
import { setCookie } from "../../utils/helper";
import { useNavigate } from "react-router";

export default function Login() {
  const [formData, setFormData] = useState<userLoginForm>({
    userName: null,
    password: null,
  });

  const [errorMsg, setErrorMsg] = useState(null);

  const navigate = useNavigate();

  const onSubmit = async () => {
    try {
      if (
        typeof formData?.userName === "string" &&
        typeof formData?.password === "string"
      ) {
        setErrorMsg(null);
        const { data } = await login({
          userName: formData.userName,
          password: formData.password,
        });
        console.log("====================================");
        console.log("data", data);
        console.log("====================================");
        if (!data.accessToken) {
          alert(1);
          throw "error happened";
        }
        console.log(data.accessToken);
        setCookie("accessToken", data.accessToken, 1500);
        navigate("/songsClose");
      }
    } catch (error: unknown) {
      console.error(error);
      setErrorMsg(error?.response?.data?.response);
      alert(2);
    }
  };

  return (
    <div className="login">
      <div className="main" style={{ color: "wheat" }}>
        <div className="glass">
          <Input<userLoginForm>
            placeHolder={"Type your username"}
            inputComponentType="text"
            preImgName="person"
            label="Username"
            attributeName="userName"
            onChange={setFormData}
            error={errorMsg ? true : false}
          />
          <Input
            placeHolder={"Type your password"}
            inputComponentType="password"
            preImgName="lock"
            label="Password"
            attributeName="password"
            onChange={setFormData}
            error={errorMsg ? true : false}
          />
          <div className="errorTextBox">{errorMsg ? errorMsg : " "}</div>

          <button
            onClick={async () => {
              await test();
            }}
            className="forgetPassword"
          >
            forget password?
          </button>

          <button className="btn btn-primary w-100 loginBtn" onClick={onSubmit}>
            Login
          </button>

          <div className="withSocial">
            <div>Or Sign up using</div>
            <SocialSignup googleIcon facebookIcon twitterIcon />
          </div>

          <div className="signupOption">
            <div className="header">Or Sign Up Using</div>
            <div className="">
              <button className="forgetPassword">SIGN UP</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
