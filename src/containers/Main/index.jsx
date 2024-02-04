const Main = ({children, className}) => {
  return (
    <main className={"bg-fifth w-screen min-h-screen " + className}>
      {children}
    </main>
  )
}


export default Main