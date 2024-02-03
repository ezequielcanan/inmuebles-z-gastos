const Button = ({children: text, style="first", className, onClick}) => {
  const styles = {
    first: "bg-fourth text-white duration-300 text-xl py-4 z-10 px-5 rounded justify-self-start flex items-center gap-x-[20px] relative overflow-hidden after:absolute after:w-0 after:h-full after:top-0 after:left-0 after:bg-primary after:duration-300 after:-z-10 after:bg-primary hover:after:w-full",
  }
  return <button className={styles[style] + " " + className} onClick={onClick}>
    {text}
  </button>
}

export default Button