const Label = ({name, text, className, ...props}) => {
  return <label htmlFor={name} className={`text-xl md:text-4xl font-ubuntu ${className || ""}`} {...props}>{text}</label>
}

export default Label