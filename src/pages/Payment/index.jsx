import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { BounceLoader } from "react-spinners"
import { FaChevronLeft, FaDownload, FaFileArrowUp, FaFileCircleCheck, FaNoteSticky } from "react-icons/fa6"
import { useForm } from "react-hook-form"
import moment from "moment"
import Form from "../../components/Form"
import Note from "../../components/Note"
import Title from "../../components/Title"
import Main from "../../containers/Main"
import Section from "../../containers/Section"
import customAxios from "../../config/axios.config"
import Label from "../../components/Label"
import Subtitle from "../../components/Subtitle"
import Input from "../../components/FormInput/Input"
import Button from "../../components/Button"
import { formatNumber } from "../../utils/numbers"
import SubpaymentCard from "../../components/SubpaymentCard"
import SelectInput from "../../components/FormInput/SelectInput"
import BillCard from "../../components/BilllCard"

const Payment = () => {
  const { pid, bid } = useParams()
  const { register, handleSubmit, reset } = useForm()
  const [payment, setPayment] = useState(false)
  const [lastPayment, setLastPayment] = useState(false)
  const [file, setFile] = useState(false)
  const [reloadFlag, setReloadFlag] = useState(false)

  useEffect(() => {
    customAxios.get(`/payment/${pid}`).then(res1 => {
      customAxios.get(`/payment/budget/${res1?.data?.payload?.budget?._id}`).then(res => {
        const lastPayment = res?.data?.payload.find((p) => p?.paymentNumber == res1?.data?.payload?.paymentNumber - 1)
        setLastPayment(lastPayment)
      })
      setPayment(res1?.data?.payload || {})
    }).catch(e => {
      setPayment("error")
    })
  }, [reloadFlag])

  const getSectionTotal = (type) => {
    const adjustment = (payment?.indexCac / payment?.budget?.baseIndex)
    const mcd = lastPayment ? ((lastPayment[type]?.amount * adjustment) - lastPayment[type]?.mcp) : 0
    const mcp = payment[type]?.amount * (adjustment - 1)
    const total = mcd + mcp + payment[type]?.amount
    const taxes = total * (payment[type]?.bills?.length ? ((payment[type]?.bills[0]?.bill?.iva + payment[type]?.bills[0]?.bill?.taxes) || 0) / 100 : 0)

    return formatNumber((total + taxes) || 0)
  }

  const addNote = async () => {
    const result = (await customAxios.post(`/payment/${payment?._id}/notes`, { date: moment(), note: "" })).data
    setReloadFlag(!reloadFlag)
  }

  const onSubmit = handleSubmit(async data => {
    data.receiver = payment?.budget?.supplier?._id
    const result = (await customAxios.post(`/bill/${pid}`, data)).data

    data.folder = `projects/${payment?.budget?.project?._id}/budgets/${payment?.budget?._id}/payments/${payment?._id}/bill/${result?.payload?._id}`
    const formData = new FormData()
    formData.append("data", JSON.stringify(data))
    formData.append("file", file)

    const fileResult = (await customAxios.post(`/bill/file/${pid}`, formData, { headers: { "Content-Type": "multipart/form-data" } })).data
    reset()
    setReloadFlag(!reloadFlag)
    setFile(false)
  })

  const getLastSubpaymentTotal = (type) => {
    const subPayment = payment[type]?.payments[payment[type]?.payments.length - 1]
    const total = subPayment?.checks?.reduce((acc, check) => check.amount + acc, 0)
    return total || 0
  }

  const billOptions = [{ text: "Certficado", value: "certificate" }, { text: "MCD", value: "mcd" }, { text: "MCP", value: "mcp" }]

  return (
    <Main className={"flex flex-col gap-y-[70px]"} paddings>
      <Link to={`/budgets/${bid}`}>
        <FaChevronLeft className="text-4xl"/>
      </Link>
      {(payment && payment != "error") ? (
        <>
          <Section>
            <Title>
              Pago {payment?.paymentNumber} - {payment?.budget?.supplier?.name}
            </Title>
            <a href={`${import.meta.env.VITE_REACT_API_URL}/api/payment/excel/${payment?._id}`} download>
              <Button style="icon" className={"text-white w-16 h-16"}>
                <FaDownload className="text-5xl p-1" />
              </Button>
            </a>
          </Section>
          <section className="flex">

          </section>
          <section className="grid sm:grid-cols-2 gap-16">
            <div className="flex flex-col gap-y-[50px]">
              <div>
                <Subtitle>Seccion A</Subtitle>
              </div>
              <div className="flex flex-col gap-y-[10px]">
                <p className="text-2xl font-bold">TOTAL A PAGAR: ${getSectionTotal("white")}</p>
                <div className="flex w-full gap-8 justify-between items-center">
                  <Link to={`/budgets/${payment?.budget?._id}/payments/${payment?._id}/a/new`}>
                    <Button className={"bg-secondary !text-black after:bg-third border-4 border-black"}>
                      Agregar adelanto
                    </Button>
                  </Link>
                </div>
                <div className="grid lg:grid-cols-2 gap-8">
                  {payment?.white?.payments?.map((p, i) => {
                    return <SubpaymentCard payment={p} type={"a"} key={i} />
                  })}
                </div>
              </div>
              <Form onSubmit={onSubmit} className={"bg-third text-black flex flex-col items-center justify-between self-center p-5"}>
                <Input type="file" className={"hidden"} containerClassName={"!border-b-0 text-center max-w-[200px] w-full"} id="file" onChange={(e) => setFile(e.target.files[0])}>
                  <Label name={"file"} className={"flex flex-col cursor-pointer text-center items-center justify-center border-4 border-black text-black max-w-[200px] w-full max-h-[200px] h-[200px]"}>
                    {!file ? <FaFileArrowUp /> : <>
                      <FaFileCircleCheck size={180} className="p-4" />
                      <p className="text-sm w-full overflow-hidden bg-white text-primary !text-wrap">{file.name}</p>
                    </>}
                  </Label>
                </Input>
                <Input register={{ ...register("iva", { required: true }) }} containerClassName={"!w-full border-b-black"} className={"!w-full max-w-[150px]"}>
                  <Label name={"iva"}>IVA:</Label>
                </Input>
                <Input register={{ ...register("taxes", { required: true }) }} containerClassName={"!w-full border-b-black"} className={"!w-full max-w-[150px]"}>
                  <Label name={"taxes"}>Otros impuestos:</Label>
                </Input>
                <Input register={{ ...register("code", { required: true }) }} containerClassName={"!w-full border-b-black"} className={"!w-full"}>
                  <Label name={"code"}>N° de factura:</Label>
                </Input>
                <Input register={{ ...register("emissionDate", { required: true }) }} type="date" containerClassName={"!w-full border-b-black"} className={"!w-full"}>
                  <Label name={"emissionDate"} text={"Fecha de emision:"} />
                </Input>
                <Input register={{ ...register("amount", { required: true }) }} placeholder={"Sin impuestos incluidos"} containerClassName={"!w-full border-b-black"} className={"!w-full"}>
                  <Label name={"amount"}>TOTAL:</Label>
                </Input>
                <SelectInput options={billOptions} optionClassName={"!text-white"} containerClassName={"!w-full border-b-black"} className={"!w-full"} register={{ ...register("concept") }}>
                  <Label name={"concept"} text={"En concepto de:"} />
                </SelectInput>
                <Button className={"text-center justify-center max-w-[200px] w-[200px]"} type="submit">
                  Subir factura
                </Button>
              </Form>
              <div className="flex flex-col gap-y-[30px] self-start w-full">
                <div className="self-start">
                  <Subtitle>Facturas</Subtitle>
                </div>
                <div className="grid xl:grid-cols-2 gap-8 w-full">
                  {payment?.white?.bills?.map((bill) => {
                    return <BillCard bill={bill} path={`/budgets/${bid}/payments/${pid}/${bill?.bill?._id}`}/>
                  })}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-y-[50px]">
              <div>
                <Subtitle>Seccion B</Subtitle>
              </div>
              <div className="flex w-full gap-8 justify-between items-center">
                <div className="flex flex-col w-full gap-y-[10px]">
                  <p className="text-2xl font-bold">TOTAL A PAGAR: ${getSectionTotal("black")}</p>
                  <div className="flex w-full gap-8 justify-between items-center">
                    <Link to={`/budgets/${payment?.budget?._id}/payments/${payment?._id}/b/new`}>
                      <Button className={"bg-secondary !text-black after:bg-third border-4 border-black"}>
                        Agregar adelanto
                      </Button>
                    </Link>
                  </div>
                  <div className="grid lg:grid-cols-2 gap-8">
                    {payment?.black?.payments?.map((p, i) => {
                      return <SubpaymentCard payment={p} type={"b"} key={i} />
                    })}
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="flex flex-col items-start gap-y-[30px]">
            <Subtitle className={"w-full sm:w-auto"}>Notas</Subtitle>
            <div className="flex flex-col gap-y-[10px] w-full">
              {payment?.notes?.length ? payment?.notes?.map((note, i) => {
                console.log(note.note)
                return <Note note={note} setReload={setReloadFlag} id={payment?._id} endpoint="payment" key={note._id} />
              }) : <p>No hay notas registradas</p>}
              <Button className={"bg-blue-500 after:bg-blue-700 self-start"} onClick={addNote}>
                Agregar nota <FaNoteSticky />
              </Button>
            </div>
          </section>
        </>
      ) : (
        !payment ? <BounceLoader size={100} /> : <Title>ERROR</Title>
      )}
    </Main>
  )
}

export default Payment