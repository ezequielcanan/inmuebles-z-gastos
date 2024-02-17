import { useEffect, useState } from "react"
import Main from "../../containers/Main"
import customAxios from "../../config/axios.config"
import Form from "../../components/Form"
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
import SelectInput from "../../components/FormInput/SelectInput"
import Input from "../../components/FormInput/Input"
import { FaChevronLeft, FaDownload, FaNoteSticky } from "react-icons/fa6"

const Budget = () => {
  const { bid } = useParams()
  const [budget, setBudget] = useState(false)
  const [payments, setPayments] = useState(false)
  const [apartments, setApartments] = useState([])
  const [choice, setChoice] = useState({})
  const [projects, setProjects] = useState([])
  const [reload, setReload] = useState(false)

  useEffect(() => {
    customAxios.get(`/budget/${bid}`).then(res => {
      setBudget(res?.data?.payload || {})
    }).catch(e => {
      setBudget("error")
    })
  }, [reload])

  useEffect(() => {
    customAxios.get("/projects?filter=false").then(res => {
      customAxios.get(`/apartments/project/${res?.data?.payload[0]?._id}`).then(apartmentsRes => {
        const projectApartments = apartmentsRes?.data?.payload
        setChoice({ project: res?.data?.payload[0]?._id, apartment: projectApartments[0]?._id, apartments: mapApartments(projectApartments), dollar: 0, total: 0, subtractType: "quota" })
        setApartments(projectApartments)
      })

      setProjects(res?.data?.payload.map((project => {
        return { text: project.title, value: project._id }
      })) || [])
    }).catch(e => {
      setProjects([])
    })
  }, [])

  useEffect(() => {
    customAxios.get(`/payment/budget/${bid}`).then(res => {
      setPayments(res?.data?.payload || [])
    })
  }, [reload])

  const onSubmit = async () => {
    const data = { supplier: budget?.supplier, apartment: choice, bid }
    const result = (await customAxios.post("/transaction/budget", data)).data
    setReload(!reload)
  }

  const mapApartments = apartments => {
    return apartments.map((a, i) => {
      return {
        value: a?._id,
        text: a?.unit
      }
    })
  }

  const onChangePropertiesApartment = (property, newValue) => {
    const updateObject = {}
    updateObject[property] = newValue
    setChoice({ ...choice, ...updateObject })
  }

  const onChangeProject = async (pid) => {
    if (projects) {
      try {
        const apartments = (await customAxios.get(`/apartments/project/${pid}`))?.data?.payload
        setApartments(apartments)
        setChoice({ ...choice, apartment: apartments[0]?._id, apartments: mapApartments(apartments), project: pid })
      }
      catch (e) {
        console.log(e)
      }
    }
  }

  const addNote = async () => {
    const result = (await customAxios.post(`/budget/${bid}/notes`, { date: moment(), note: "" })).data
    setBudget(result?.payload)
  }

  return (
    <Main className={"flex flex-col gap-y-[70px] py-[120px]"} paddings>
      <Link to={"/budgets"}>
        <FaChevronLeft className="text-4xl" />
      </Link>
      {(budget && budget != "error" && payments && projects && apartments) ? (
        <>
          <Section>
            <Title className={"text-center xl:text-start"}>
              Presupuesto {budget?.title || budget?.code || budget?.date}: {budget?.supplier?.name} - {budget?.project?.title}
            </Title>
            <Link to={`/budgets/${budget?._id}/payments/new`}>
              <Button>Agregar Certificado</Button>
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
                    console.log(apartment)
                    return <ApartmentCard key={i} transaction={apartment?.apartment} subtractionType={apartment?.discount} />
                  }))}
                  <Form className={"bg-primary p-4 gap-y-2"} onSubmit={onSubmit}>
                    <h3 className="text-center text-white text-xl">Nuevo departamento</h3>
                    <SelectInput options={[{ value: "quota", text: "Por cuota" }, { value: "total", text: "Al total" }]} value={choice?.subtractType} className={"w-full text-white !text-sm"} optionClassName={"!text-white !text-lg"} onChange={(e) => onChangePropertiesApartment("subtractType", e?.currentTarget?.value)} />
                    <SelectInput options={choice?.apartments} prop className={"w-full text-white !text-sm"} optionClassName={"!text-white !text-lg"} value={choice?.apartment} onChange={(e) => onChangePropertiesApartment("apartment", e?.currentTarget?.value)} />
                    <SelectInput options={projects} className={"w-full text-white !text-sm"} optionClassName={"!text-white !text-lg"} value={choice?.project} onChange={(e) => onChangeProject(e?.currentTarget?.value)} />
                    <Input placeholder={"Equivalente a:"} type="number" value={choice?.total || ""} onChange={(e) => onChangePropertiesApartment("total", Number(e.currentTarget?.value))} className={"!w-full text-white !text-sm"} />
                    <Input placeholder={"Valor USD"} type="number" value={choice?.dollar || ""} className={"!w-full text-white !text-sm"} onChange={(e) => onChangePropertiesApartment("dollar", Number(e.currentTarget?.value))} />
                    <Button type="submit" style="submit" className={"text-black !text-lg !py-1"}>Agregar depto</Button>
                  </Form>
                </div>
              </>
            ) : null}
          </section>
          <section className="flex flex-col items-start gap-y-[30px]">
            <div className="flex w-full justify-between items-center">
              <Subtitle className={"w-full sm:w-auto"}>Pagos:</Subtitle>
              <div className="flex gap-x-8">
                <a href={`${import.meta.env.VITE_REACT_API_URL}/api/budget/excel/${budget?._id}`} download className="text-3xl">
                  <Button className={"flex gap-x-4"}>A <FaDownload /></Button>
                </a>
                <a href={`${import.meta.env.VITE_REACT_API_URL}/api/budget/excel/b/${budget?._id}`} download className="text-3xl">
                  <Button className={"flex gap-x-4"}>B <FaDownload /></Button>
                </a>
              </div>
            </div>
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
                return <Note note={note} id={bid} setReload={setReload} key={note._id} />
              }) : <p>No hay notas registradas</p>}
              <Button className={"bg-blue-500 after:bg-blue-700 self-start"} onClick={addNote}>
                Agregar nota <FaNoteSticky />
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