import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { BounceLoader } from "react-spinners"
import Main from "../../containers/Main"
import Title from "../../components/Title"
import Section from "../../containers/Section"
import customAxios from "../../config/axios.config"
import Subtitle from "../../components/Subtitle"
import Button from "../../components/Button"
import { FaPlus } from "react-icons/fa"
import MovementRow from "../../components/MovementRow"

const Account = () => {
  const { aid } = useParams()
  const [account, setAccount] = useState(false)
  const [movements, setMovements] = useState([])

  useEffect(() => {
    customAxios.get(`/account/${aid}`).then(res => {
      setAccount(res?.data?.payload)
    })
  }, [])

  useEffect(() => {
    customAxios.get(`/movement/${aid}`).then(res => setMovements(res?.data?.payload))
  }, [])

  return (
    <Main className={"flex flex-col gap-y-[20px] pb-[120px]"} paddings>
      {(account && account != "error") ? (
        <>
          <Section>
            <Title>Banco {account.bank} {account.society}</Title>
          </Section>
          <section className="flex flex-col gap-y-[10px] text-xl">
            <p>CUIT: {account.cuit}</p>
            <p>CBU: {account.cbu}</p>
            <p>Alias: {account.alias}</p>
            <p>Titular: {account.name}</p>
          </section>
          <section className="flex flex-col items-start gap-y-[30px] pt-[60px]">
            <div className="flex w-full gap-8 items-center flex-col sm:flex-row justify-between">
              <Subtitle>Movimientos</Subtitle>
              <Link to={`/accounts/${aid}/new-movement`}>
                <Button className={"flex"}>
                  Agregar movimiento <FaPlus />
                </Button>
              </Link>
            </div>
            <div className="overflow-x-auto w-full">
              <table className="w-full border-4 border-b-0 border-secondary">
                <thead className="w-full border-b-4 border-secondary">
                  <tr>
                    <th className="text-start p-3 whitespace-nowrap bg-secondary text-2xl text-white">Fecha</th>
                    <th className="text-start p-3 whitespace-nowrap bg-secondary text-2xl text-white">N° cheque</th>
                    <th className="text-start p-3 whitespace-nowrap bg-secondary text-2xl text-white">Detalle</th>
                    <th className="text-start p-3 whitespace-nowrap bg-secondary text-2xl text-white">Credito</th>
                    <th className="text-start p-3 whitespace-nowrap bg-secondary text-2xl text-white">Debito</th>
                    <th className="text-start p-3 whitespace-nowrap bg-secondary text-2xl text-white">Brutos</th>
                    <th className="text-start p-3 whitespace-nowrap bg-secondary text-2xl text-white">6XMIL</th>
                    <th className="text-start p-3 whitespace-nowrap bg-secondary text-2xl text-white">6XMIL</th>
                    <th className="text-start p-3 whitespace-nowrap bg-secondary text-2xl text-white">Saldo</th>
                  </tr>
                </thead>
                <tbody>
                  {movements.map((movement) => {
                    return <MovementRow movement={movement} key={movement?._id} />
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : (
        !account ? <BounceLoader size={100} /> : <Title>ERROR</Title>
      )}
    </Main>
  )
}

export default Account