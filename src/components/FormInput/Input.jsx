const Input = ({type="text", placeholder, className, containerClassName, children, register, ...props}) => {
  return (
    <div className={"flex gap-x-[20px] items-center justify-between " + containerClassName}>
      {children}
      <input type={type} placeholder={placeholder} className={"py-2 px-3 text-4xl !outline-none bg-transparent placeholder:text-white/70 duration-500 "} {...register} {...props}/>
    </div>
  )
}

export default Input