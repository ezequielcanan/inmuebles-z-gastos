const Title = ({children: text, className, ...props}) => {
  return (
    <h1 className={"text-5xl sm:text-6xl font-ubuntu font-bold " + className} {...props}>{text}</h1>
  )
}

export default Title