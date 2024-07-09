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
  error: boolean;
}

type inputComponentType = "text" | "number" | "tel" | "password";

export default function Input<T>({
  placeHolder,
  inputComponentType,
  preImgName,
  label,
  attributeName,
  error,
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

        <div
          className="inputBox"
          style={error ? { border: "3.5px solid red" } : {}}
        >
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
