const SelectInput = ({ options, className, containerClassName, optionClassName, children, register, ...props }) => {
  return (
    <div className={"flex gap-x-2 items-center justify-between border-b-4 " + containerClassName}>
      {children}
      <select className={"bg-white/20 w-auto py-2 px-3 text-lg sm:text-xl md:text-4xl !outline-none bg-transparent placeholder:text-white/70 duration-500 " + className} {...register} {...props}>
        {options?.map((option,i) => {
          return <option value={option.value} className={"text-3xl bg-blue-900 " + optionClassName} key={i}>{option.text}</option>
        })}
      </select>
    </div>
  )
}

export default SelectInput