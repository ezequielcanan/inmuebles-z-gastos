const Button = ({children: text, style="first", className, onClick, ...props}) => {
  const styles = {
    first: "bg-fourth text-white duration-300 text-xl py-4 z-10 px-5 rounded justify-self-start flex items-center gap-x-[20px] relative overflow-hidden after:absolute after:w-0 after:h-full after:top-0 after:left-0 after:bg-primary after:duration-300 after:-z-10 after:bg-primary hover:after:w-full",
    icon: "duration-500 py-3 px-3 flex w-[50px] gap-x-[20px] rounded-full items-center justify-center bg-secondary hover:bg-primary",
    submit: "bg-third py-3 px-3 text-xl shrink md:text-4xl"
  }
  return <button className={styles[style] + " " + className} onClick={onClick} {...props}>
    {text}
  </button>
}

export default Button