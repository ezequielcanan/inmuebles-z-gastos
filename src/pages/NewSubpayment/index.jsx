import { Link, useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { FaPlus, FaFileArrowUp } from "react-icons/fa6"
import { RiSubtractFill } from "react-icons/ri"
import moment from "moment"
import SelectInput from "../../components/FormInput/SelectInput"
import customAxios from "../../config/axios.config.js"
import Main from "../../containers/Main"
import { BounceLoader } from "react-spinners"
import Section from "../../containers/Section"
import Title from "../../components/Title"
import Form from "../../components/Form"
import Label from "../../components/Label"
import Button from "../../components/Button"
import { useForm } from "react-hook-form"
import Input from "../../components/FormInput/Input"
import { FaChevronLeft } from "react-icons/fa"
import PaymentMethodForm from "../../components/PaymentMethodForm/index.jsx"

const NewSubpayment = () => {
  const { pid, bid, type } = useParams()
  const { register, handleSubmit } = useForm()
  const [accounts, setAccounts] = useState([])
  const [payment, setPayment] = useState()
  const [checks, setChecks] = useState([])
  const [transfers, setTransfers] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    customAxios.get(`/payment/${pid}`).then(res => {
      setPayment(res?.data?.payload || {})
    }).catch(e => {
      setPayment("error")
    })
  }, [])

  useEffect(() => {
    customAxios.get(`/account`).then(res => {
      setAccounts(res?.data?.payload.map((acc) => {
        return {
          value: acc?._id,
          text: acc?.alias
        }
      }) || [])
    })
  }, [])

  const blackSubmit = handleSubmit(async data => {
    const result = (await customAxios.post(`/black-payment/${pid}`, data)).data
    navigate(`/budgets/${payment?.budget?._id}/payments/${payment?._id}`)
  })

  const whiteSubmit = handleSubmit(async data => {
    data.cashPaid = { total: data.cashPaid || 0, account: data.account }
    data.date = data.date || moment()
    if (data?.retention) data.retention.detail = `Retencion N° ${data?.retention?.code}, certificado ${payment?.paymentNumber}, presupuesto ${payment?.budget?.title || ""} ${payment?.budget?.supplier?.name || ""} ${payment?.budget?.project?.title || ""}`


    const checksResult = (await customAxios.post("/check", checks)).data
    const transferResult = (await customAxios.post("/transfer", transfers)).data

    await Promise.all(checksResult?.payload?.map(async (check, i) => {
      if (checks[i].file) {
        const fileData = { folder: `projects/${payment?.budget?.project?._id}/budgets/${payment?.budget?._id}/payments/${payment?._id}/checks/${check?._id}` }
        const formData = new FormData()
        formData.append("data", JSON.stringify(fileData))
        formData.append("file", checks[i].file)
        await customAxios.post(`/check/file`, formData, { headers: { "Content-Type": "multipart/form-data" } })
      }
    }))

    await Promise.all(transferResult?.payload?.map(async (transfer, i) => {
      if (transfers[i].file) {
        const fileData = { folder: `projects/${payment?.budget?.project?._id}/budgets/${payment?.budget?._id}/payments/${payment?._id}/transfers/${transfer?._id}` }
        const formData = new FormData()
        formData.append("data", JSON.stringify(fileData))
        formData.append("file", transfers[i].file)
        await customAxios.post(`/transfer/file`, formData, { headers: { "Content-Type": "multipart/form-data" } })
      }
    }))

    data.checks = checksResult.payload.map((c, i) => c._id)
    data.transfers = transferResult.payload.map((t, i) => t._id)
    data.materials = {material: data.materialsMaterial, amount: data.materialsAmount, date: data.materialsDate} 
    const paymentResult = (await customAxios.post(`/white-payment/${pid}`, data)).data

    navigate(`/budgets/${payment?.budget?._id}/payments/${payment?._id}`)
  })

  const onSubmit = type == "a" ? whiteSubmit : blackSubmit

  const addArrayObj = (array = checks, setFunction = setChecks, type = "check") => {
    if (accounts && payment) {
      setFunction([...array, { id: (array[array.length - 1]?.id + 1) || 1, detail: `${type == "check" ? "Cheque" : "Transferencia"} certificado ${payment?.paymentNumber}, presupuesto ${payment?.budget?.title || ""} ${payment?.budget?.supplier?.name || ""} ${payment?.budget?.project?.title || ""}`, account: accounts[0]?.value }])
    }
  }

  return (
    <Main className={"grid items-center gap-4 justify-center"} paddings>
      {(payment && payment != "error") ? (
        <>
          <Section className={"gap-x-[40px] items-center"}>
            <Link to={`/budgets/${bid}/payments/${pid}`}>
              <FaChevronLeft className="text-4xl"/>
            </Link>
            <Title>Pago {type.toUpperCase()} - Certificado {payment?.paymentNumber} - Presupuesto {payment?.budget?.title || payment?.budget?.supplier?.name}</Title>
          </Section>
          <Section style="form" className={"w-full"}>
            <Form onSubmit={onSubmit}>
              <Input type="date" containerClassName={"!w-full"} register={{...register("date")}}>
                <Label name={"date"} text={"Fecha del pago:"} />
              </Input>
              {type == "a" ? (
                <>
                  {payment?.white?.bills?.find((bill) => bill.concept == "certificate") &&
                    <>
                      <Input type="date" containerClassName={"!w-full"} register={{...register("retention.date")}}>
                        <Label name={"date"} text={"Fecha de retencion:"} />
                      </Input>
                      <Input register={{ ...register("retention.amount") }} placeholder={"$"}>
                        <Label text={"Retencion:"} />
                      </Input>
                      <Input register={{ ...register("retention.code") }}>
                        <Label text={"Numero de retencion:"} />
                      </Input>
                      <SelectInput options={accounts} className={"!w-full"} register={{ ...register("retention.account") }}>
                        <Label text={"Cuenta retencion:"} />
                      </SelectInput>
                    </>}
                  <Input className={"!w-full max-w-[250px]"} placeholder={"TOTAL"} register={{...register("materialsAmount")}}>
                    <Label text={"Materiales"} name={"materialsAmount"}/>
                    <Input placeholder={"Material"} register={{...register("materialsMaterial")}} className={"max-w-[300px]"}/>
                    <Input type="date" register={{...register("materialsDate")}}/>
                  </Input>
                  <h2 className="text-2xl md:text-4xl font-ubuntu">Cheques</h2>
                  <PaymentMethodForm paymentMethod={checks} setPaymentMethod={setChecks} accounts={accounts}/>
                  <Button style="icon" className={"bg-success hover:!bg-green-600"} type="button" onClick={() => addArrayObj()}><FaPlus className="text-4xl cursor pointers" /></Button>
                  
                  <h2 className="text-2xl md:text-4xl font-ubuntu border-t-4 pt-4">Transferencias</h2>
                  <PaymentMethodForm paymentMethod={transfers} setPaymentMethod={setTransfers} accounts={accounts} placeholder="transferencia" expiration={false}/>
                  <Button style="icon" className={"bg-success hover:!bg-green-600"} type="button" onClick={() => addArrayObj(transfers, setTransfers, "transfer")}><FaPlus className="text-4xl cursor pointers" /></Button>
                </>) : (
                <>
                  <SelectInput options={[{text:"Dolar", value: "dollar"}, {text: "Pesos", value: "pesos"}]} containerClassName={"!w-full flex justify-between"} className={"!w-full max-w-[300px]"} register={{...register("currency")}}>
                    <Label text={"Moneda"} name={"currency"}/>
                  </SelectInput>
                  <Input containerClassName={"!w-full"} type="number" register={{ ...register("cashPaid") }}>
                    <Label name={"cashPaid"} text={"Efectivo pagado:"} />
                  </Input>
                  <Input containerClassName={"!w-full"} type="number" register={{ ...register("dollarPrice") }}>
                    <Label name={"dollarPrice"} text={"Precio del dolar:"} />
                  </Input>
                </>
              )}
              <Button className={"text-black"} type="submit" style="submit">Enter</Button>
            </Form>
          </Section>
        </>
      ) : (
        !payment ? <BounceLoader size={100} /> : <Title>ERROR</Title>
      )}
    </Main>
  )
}

export default NewSubpayment