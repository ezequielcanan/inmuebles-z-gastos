const Input = ({type="text", placeholder, className, containerClassName, children, register, ...props}) => {
  return (
    <div className={"flex gap-x-2 items-center justify-between border-b-4 " + containerClassName}>
      {children}
      <input type={type} step={0.01} onWheel={e => e.target.blur()} placeholder={placeholder} className={"bg-white/20 w-full sm:w-auto py-2 px-3 text-lg sm:text-xl md:text-4xl !outline-none bg-transparent placeholder:text-white/70 duration-500 shrink "+(className || "")} {...register} {...props}/>
    </div>
  )
}

export default Input