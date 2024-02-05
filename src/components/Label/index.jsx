const Label = ({name, text, className, children, ...props}) => {
  return <label htmlFor={name} className={`text-xl md:text-4xl font-ubuntu ${className || ""}`} {...props}>{text}{children}</label>
}

export default Label