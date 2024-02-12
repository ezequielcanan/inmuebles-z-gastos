import { useEffect, useState } from "react"
import Main from "../../containers/Main"
import customAxios from "../../config/axios.config"

const Bill = () => {
  const [bill, setBill] = useState()

  useEffect(() => {
    customAxios.get("/bill")
  }, [])
  return <Main paddings>

  </Main>
}

export default Bill