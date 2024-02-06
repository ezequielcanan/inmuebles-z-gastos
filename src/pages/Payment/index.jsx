import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { BounceLoader } from "react-spinners"
import Title from "../../components/Title"
import Main from "../../containers/Main"
import Section from "../../containers/Section"
import customAxios from "../../config/axios.config"

const Payment = () => {
  const {pid} = useParams()
  const [payment, setPayment] = useState(false)

  useEffect(() => {
    customAxios.get(`/payment/${pid}`).then(res => {
      setPayment(res?.data?.payload || {})
    }).catch(e => {
      setPayment("error")
    })
  }, [])

  return (
    <Main className={"flex flex-col gap-y-[70px]"} paddings>
      {(payment && payment != "error") ? (
        <>
          <Section>
            <Title>
              Pago {payment?.paymentNumber} - {payment?.budget?.supplier?.name}
            </Title>
          </Section>
        </>
      ) : (
        !payment ? <BounceLoader size={100} /> : <Title>ERROR</Title>
      )}
    </Main>
  )
}

export default Payment