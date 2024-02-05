const Section = ({style="first", className, children, ...props}) => {
  const styles = {
    "first": "flex flex-col gap-y-[30px] md:flex-row justify-between items-center",
    "form": "bg-secondary flex flex-col items-center gap-y-[70px] p-3 md:p-7 text-white"
  }
  return <section className={`${styles[style]} ${className}`} {...props}>{children}</section>
}

export default Section