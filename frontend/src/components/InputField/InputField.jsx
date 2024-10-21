import "./InputField.css";

const InputField = ({
  type,
  name,
  placeholder,
  value,
  onChange,
  className,
}) => {
  return (
    <div className="input-group">
      <input
        type={type}
        name={name}
        className={className}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default InputField;
