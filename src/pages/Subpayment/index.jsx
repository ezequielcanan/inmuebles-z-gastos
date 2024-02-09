import { useParams } from "react-router-dom"
import Main from "../../containers/Main"
import Section from "../../containers/Section"
import { useEffect, useState } from "react"

const Subpayment = () => {
  const {sid} = useParams()
  const [subpayment, setSubpayment] = useState(false)

  useEffect(() => {

  }, [])

  return (
    <Main className={"flex flex-col gap-y-[70px]"} paddings>
      <Section>

      </Section>
    </Main>
  )
}

export default Subpayment