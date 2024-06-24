import person from "../../assets/icons/person.png";
import lock from "../../assets/icons/unlock.png";
import email from "../../assets/icons/mail.png";

interface input<T> {
  placeHolder?: string;
  inputComponentType: inputComponentType;
  preImgName: string;
  label: string;
  attributeName: string;
  onChange: React.Dispatch<React.SetStateAction<T>>;
}

type inputComponentType = "text" | "number" | "tel" | "password";

export default function Input<T>({
  placeHolder,
  inputComponentType,
  preImgName,
  label,
  attributeName,
  onChange,
}: input<T>) {
  const id = inputComponentType + label;

  const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange((prev) => ({ ...prev, [attributeName]: e.target.value }));
  };
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
            onChange={inputChange}
          />
        </div>
      </div>
    </div>
  );
}
