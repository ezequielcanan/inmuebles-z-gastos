const Main = ({children, className, paddings=false}) => {
  return (
    <main className={`bg-fifth w-full min-h-screen ${paddings ? "pt-[150px] px-[10px] xl:pt-[100px] xl:pl-[370px] xl:pr-[100px]" : ""} ${className}`}>
      {children}
    </main>
  )
}


export default Main