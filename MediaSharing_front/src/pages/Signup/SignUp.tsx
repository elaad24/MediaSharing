import SocialSignup from "../../components/SocialSignup";
import Input from "../../components/common/Input";

export default function Signup() {
  return (
    <div className="signup">
      <div className="main">
        <div className="glass">
          <div className="title">sign up</div>
          <Input
            placeHolder={"Type your Username"}
            inputComponentType="text"
            preImgName="person"
            label="Username"
          />
          <Input
            placeHolder={"Type your Email"}
            inputComponentType="text"
            preImgName="email"
            label="Email"
          />
          <Input
            placeHolder={"Type your Password"}
            inputComponentType="password"
            preImgName="lock"
            label="Password"
          />
          <Input
            placeHolder={"Type your Password"}
            inputComponentType="password"
            preImgName="lock"
            label="Repeat Password"
          />

          <div className="withSocial">
            <div>Or Sign in using</div>
            <SocialSignup googleIcon facebookIcon twitterIcon />
          </div>

          <div className="signupOption">
            <div className="">
              <button className="textButton"> {"SIGN UP -->"}</button>
            </div>
            <button className="btn btn-primary  loginBtn">Login</button>
          </div>
        </div>
      </div>
    </div>
  );
}
