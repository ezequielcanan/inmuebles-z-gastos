import { useEffect, useState } from "react"
import Main from "../../containers/Main"
import customAxios from "../../config/axios.config"
import { Link, useParams } from "react-router-dom"
import Section from "../../containers/Section"
import Title from "../../components/Title"
import { BounceLoader } from "react-spinners"
import moment from "moment"
import ApartmentCard from "../../components/ApartmentCard"
import Subtitle from "../../components/Subtitle"
import { formatNumber } from "../../utils/numbers"
import Button from "../../components/Button"
import PaymentCard from "../../components/PaymentCard"
import Note from "../../components/Note"
import { FaNoteSticky } from "react-icons/fa6"

const Budget = () => {
  const { bid } = useParams()
  const [budget, setBudget] = useState(false)
  const [payments, setPayments] = useState(false)
  const [reload, setReload] = useState(false)

  useEffect(() => {
    customAxios.get(`/budget/${bid}`).then(res => {
      setBudget(res?.data?.payload || {})
    }).catch(e => {
      setBudget("error")
    })
  }, [reload])

  useEffect(() => {
    customAxios.get(`/payment/budget/${bid}`).then(res => {
      setPayments(res?.data?.payload || [])
    })
  }, [reload])

  const addNote = async () => {
    const result = (await customAxios.post(`/budget/${bid}/notes`, {date: moment(), note: ""})).data
    setBudget(result?.payload)
  }

  return (
    <Main className={"flex flex-col gap-y-[70px] py-[120px]"} paddings>
      {(budget && budget != "error" && payments) ? (
        <>
          <Section>
            <Title className={"text-center xl:text-start"}>
              Presupuesto {budget?.title || budget?.code || budget?.date}: {budget?.supplier?.name} - {budget?.project?.title}
            </Title>
            <Link to={`/budgets/${budget?._id}/payments/new`}>
              <Button>Pagar cuota</Button>
            </Link>
          </Section>
          <section className="flex flex-col items-start gap-y-[30px]">
            <Subtitle className={"w-full sm:w-auto"}>Datos del presupuesto:</Subtitle>
            <div className="grid grid-flow-row md:grid-cols-2 lg:grid-cols-3 p-2 w-full gap-2 bg-white">
              <p className="text-3xl bg-secondary py-3 px-3">Total: {formatNumber(budget?.total)}</p>
              <p className="text-3xl bg-secondary py-3 px-3">Pagado: {formatNumber(budget?.advanced)}</p>
              <p className="text-3xl bg-secondary py-3 px-3">Restante: {formatNumber(budget?.total - budget?.advanced)}</p>
              <p className="text-3xl bg-secondary py-3 px-3">Adelanto: {formatNumber(budget?.booking || 0)}</p>
              <p className="text-3xl bg-secondary py-3 px-3">Total en USD: {formatNumber(budget?.total / budget?.dollarPrice)}</p>
              <p className="text-3xl bg-secondary py-3 px-3">{budget?.paymentType == "quotas" ? `En ${budget?.quotas} cuotas` : "Por avance"}</p>
              <p className="text-3xl bg-secondary py-3 px-3">Indice base: {formatNumber(budget?.baseIndex)}</p>
              <div className="flex justify-between bg-secondary py-2 px-3">
                <p className="text-3xl bg-secondary py-3 px-3">A: %{formatNumber(budget?.percentage)}</p>
              </div>
              <div className="flex justify-between bg-secondary py-2 px-3">
                <p className="text-3xl bg-secondary py-3 px-3">B: %{formatNumber(100 - budget?.percentage)}</p>
              </div>
            </div>
          </section>
          <section className="flex flex-col items-start gap-y-[30px]">
            {budget?.paidApartments ? (
              <>
                <Subtitle className={"w-full sm:w-auto"}>Departamentos entregados:</Subtitle>
                <div className="grid px-2 w-full lg:grid-cols-2 xl:grid-cols-3 xl:p-0 gap-16">
                  {budget?.paidApartments.map(((apartment, i) => {
                    return <ApartmentCard key={i} transaction={apartment?.apartment} subtractionType={apartment?.discount} />
                  }))}
                </div>
              </>
            ) : null}
          </section>
          <section className="flex flex-col items-start gap-y-[30px]">
            <Subtitle className={"w-full sm:w-auto"}>Pagos:</Subtitle>
            <div className="grid px-2 w-full lg:grid-cols-2 xl:grid-cols-3 xl:p-0 gap-16">
              {payments.length ? payments?.map((payment, i) => {
                return <PaymentCard payment={payment} nextPayment={payments[i + 1]} budget={budget} key={i} />
              }) : <p>No hay pagos registrados</p>}
            </div>
          </section>
          <section className="flex flex-col items-start gap-y-[30px]">
            <Subtitle className={"w-full sm:w-auto"}>Notas</Subtitle>
            <div className="flex flex-col gap-y-[10px] w-full">
              {budget?.notes?.length ? budget?.notes?.map((note, i) => {
                console.log(note.note)
                return <Note note={note} bid={bid} setReload={setReload} key={note._id}/>
              }) : <p>No hay notas registradas</p>}
              <Button className={"bg-blue-500 after:bg-blue-700 self-start"} onClick={addNote}>
                Agregar nota <FaNoteSticky/>
              </Button>
            </div>
          </section>
        </>
      ) : (
        !budget ? <BounceLoader size={100} /> : <Title>ERROR</Title>
      )}
    </Main>
  )
}

export default Budget