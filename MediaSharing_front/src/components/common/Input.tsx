import person from "../../assets/icons/person.png";
import lock from "../../assets/icons/unlock.png";
import email from "../../assets/icons/mail.png";

interface input {
  placeHolder?: string;
  inputComponentType: inputComponentType;
  preImgName: string;
  label: string;
}

type inputComponentType = "text" | "number" | "tel" | "password";

export default function Input({
  placeHolder,
  inputComponentType,
  preImgName,
  label,
}: input) {
  const id = inputComponentType + label;

  return (
    <div className="input_component">
      <div className="input">
        <label htmlFor={id}>{label}</label>

        <div className="inputBox">
          {preImgName == "person" ? (
            <img src={person} alt="" />
          ) : preImgName == "lock" ? (
            <img src={lock} alt="" />
          ) : preImgName == "email" ? (
            <img src={email} alt="" />
          ) : (
            ""
          )}
          <input
            type={inputComponentType}
            placeholder={placeHolder}
            name={id}
            id={id}
          />
        </div>
      </div>
    </div>
  );
}
