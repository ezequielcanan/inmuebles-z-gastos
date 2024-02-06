const Subtitle = ({children: text, className, ...props}) => {
  return (
    <h2 className={"text-3xl rounded-md text-center text-white xl:text-start bg-primary shadow-[10px_10px_0px_0px_#f96e1b] py-2 px-3 font-ubuntu " + className} {...props}>{text}</h2>
  )
}

export default Subtitle