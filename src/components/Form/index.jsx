const Form = ({children, className, ...props}) => {
  return (
    <form action="" className={"flex flex-col w-full gap-y-[20px] " + className} {...props}>
      {children}
    </form>
  )
}

export default Form