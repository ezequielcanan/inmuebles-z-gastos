const Form = ({children, className, ...props}) => {
  return (
    <form action="" className={"flex flex-col gap-y-[20px] " + className} {...props}>
      {children}
    </form>
  )
}

export default Form