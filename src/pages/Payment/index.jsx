import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { BounceLoader } from "react-spinners"
import { FaFileArrowUp, FaFileCircleCheck } from "react-icons/fa6"
import { useForm } from "react-hook-form"
import Form from "../../components/Form"
import Title from "../../components/Title"
import Main from "../../containers/Main"
import Section from "../../containers/Section"
import customAxios from "../../config/axios.config"
import Label from "../../components/Label"
import Subtitle from "../../components/Subtitle"
import Input from "../../components/FormInput/Input"
import Button from "../../components/Button"

const Payment = () => {
  const { pid } = useParams()
  const { register, handleSubmit, reset } = useForm()
  const [payment, setPayment] = useState(false)
  const [file, setFile] = useState(false)
  const [reloadFlag, setReloadFlag] = useState(false)

  useEffect(() => {
    customAxios.get(`/payment/${pid}`).then(res => {
      setPayment(res?.data?.payload || {})
    }).catch(e => {
      setPayment("error")
    })
  }, [reloadFlag])

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
    const total = subPayment?.checks?.reduce((acc, check) => check.amount + acc, subPayment.cashPaid.total)
    return total || 0
  }

  return (
    <Main className={"flex flex-col gap-y-[70px]"} paddings>
      {(payment && payment != "error") ? (
        <>
          <Section>
            <Title>
              Pago {payment?.paymentNumber} - {payment?.budget?.supplier?.name}
            </Title>
          </Section>
          <section className="grid sm:grid-cols-2 gap-16">
            <div className="flex flex-col gap-y-[50px]">
              <div>
                <Subtitle>Seccion A</Subtitle>
              </div>
              <div className="flex flex-col gap-y-[10px]">
                <div className="flex w-full gap-8 justify-between items-center">
                  <p className="text-xl">Último adelanto: {getLastSubpaymentTotal("white") ? "$"+getLastSubpaymentTotal("white") : "No hay adelantos"}</p>
                  <Link to={`/budgets/${payment?.budget?._id}/payments/${payment?._id}/a/new`}>
                    <Button className={"bg-secondary !text-black after:bg-third border-4 border-black"}>
                      Agregar adelanto
                    </Button>
                  </Link>
                </div>
                {!payment?.white?.bill && <Form onSubmit={onSubmit} className={"bg-secondary text-white flex flex-col items-center justify-between self-center p-5"}>
                  <Input type="file" className={"hidden"} containerClassName={"border-b-0 text-center max-w-[200px] w-full"} id="file" onChange={(e) => setFile(e.target.files[0])}>
                    <Label name={"file"} className={"flex flex-col cursor-pointer text-center items-center justify-center border-4 border-white text-white max-w-[200px] w-full max-h-[200px] h-[200px]"}>
                      {!file ? <FaFileArrowUp /> : <>
                        <FaFileCircleCheck size={180} className="p-4" />
                        <p className="text-sm w-full overflow-hidden bg-white text-primary !text-wrap">{file.name}</p>
                      </>}
                    </Label>
                  </Input>
                  <Input register={{...register("iva", {required: true})}} containerClassName={"!w-full"} className={"!w-full max-w-[150px]"}>
                    <Label name={"iva"}>IVA:</Label>
                  </Input>
                  <Input register={{...register("code", {required: true})}} containerClassName={"!w-full"} className={"!w-full"}>
                    <Label name={"code"}>N° de factura:</Label>
                  </Input>
                  <Input register={{ ...register("emissionDate", {required: true}) }} type="date" containerClassName={"!w-full"} className={"!w-full"}>
                    <Label name={"emissionDate"} text={"Fecha de emision:"} />
                  </Input>
                  <Input register={{...register("amount", {required: true})}} placeholder={"Con iva incluido"} containerClassName={"!w-full"} className={"!w-full"}>
                    <Label name={"amount"}>TOTAL:</Label>
                  </Input>
                  <Button className={"text-center justify-center max-w-[200px] w-[200px]"} type="submit">
                    Subir factura
                  </Button>
                </Form>}
              </div>
            </div>
            <div className="flex flex-col gap-y-[50px]">
              <div>
                <Subtitle>Seccion B</Subtitle>
              </div>
              <div>
                <p className="text-xl">Último adelanto: {payment?.black?.payments[payment?.black?.payments.length - 1]?.checks?.length || "No hay adelantos"}</p>
              </div>
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