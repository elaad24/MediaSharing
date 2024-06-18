import facebook from "../assets/icons/facebook.png";
import google from "../assets/icons/google.png";
import twitter from "../assets/icons/twitter.png";

interface SocialSighup {
  facebookIcon?: boolean;
  twitterIcon?: boolean;
  googleIcon?: boolean;
}
export default function SocialSignup({
  facebookIcon = false,
  twitterIcon = false,
  googleIcon = false,
}: SocialSighup) {
  return (
    <div className="SocialSignup">
      {twitterIcon && <img className="icon" src={twitter} />}
      {facebookIcon && <img className="icon" src={facebook} />}
      {googleIcon && <img className="icon" src={google} />}
    </div>
  );
}
