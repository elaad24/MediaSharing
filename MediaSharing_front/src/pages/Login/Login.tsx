import SocialSignup from "../../components/SocialSignup";
import Input from "../../components/common/Input";

export default function Login() {
  return (
    <div className="login">
      <div className="main" style={{ color: "wheat" }}>
        <div className="glass">
          <Input
            placeHolder={"Type your username"}
            inputComponentType="text"
            preImgName="person"
            label="Username"
          />
          <Input
            placeHolder={"Type your password"}
            inputComponentType="password"
            preImgName="lock"
            label="Password"
          />

          <button className="forgetPassword">forget password?</button>

          <button className="btn btn-primary w-100 loginBtn">Login</button>

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
