import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Link } from "react-router-dom"
import { FaChevronLeft, FaPlus } from "react-icons/fa"
import { BounceLoader } from "react-spinners"
import { useForm } from "react-hook-form"
import customAxios from "../../config/axios.config"
import Main from "../../containers/Main"
import Section from "../../containers/Section"
import Title from "../../components/Title"
import PaymentMethodForm from "../../components/PaymentMethodForm"
import Input from "../../components/FormInput/Input"
import Label from "../../components/Label"
import Button from "../../components/Button"
import Form from "../../components/Form"
import moment from "moment"


const EditSubpayment = () => {
  const { sid, pid, bid, type } = useParams()
  const { register, handleSubmit } = useForm()
  const [payment, setPayment] = useState(false)
  const [accounts, setAccounts] = useState(false)
  const [subpayment, setSubpayment] = useState(false)
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

  useEffect(() => {
    customAxios.get(`/${type == "a" ? "white-payment" : "black-payment"}/${sid}`).then(res => {
      const resChecks = res?.data?.payload?.checks
      const resTransfers = res?.data?.payload?.transfers
      setChecks(resChecks.map((check, i) => {
        return { ...check, emissionDate: moment.utc(check.emissionDate).format("YYYY-MM-DD"), expirationDate: moment.utc(check.expirationDate).format("YYYY-MM-DD"), old: true, id: i }
      }))
      setTransfers(resTransfers.map((transfer, i) => {
        return { ...transfer, emissionDate: moment.utc(transfer.emissionDate).format("YYYY-MM-DD"), old: true, id: i }
      }))
      setSubpayment(res?.data?.payload || {})
    }).catch(e => {
      setSubpayment("error")
    })
  }, [])

  const blackSubmit = handleSubmit(async data => {
    const result = (await customAxios.post(`/black-payment/${pid}`, data)).data
    navigate(`/budgets/${payment?.budget?._id}/payments/${payment?._id}`)
  })

  const whiteSubmit = handleSubmit(async data => {
    data.cashPaid = { total: data.cashPaid || 0, account: data.account }
    data.date = moment()
    payment?.white?.bills.length && (data.retention = { amount: data.retention, code: data.retentionNumber })
    const checksResult = (await customAxios.post("/check", checks.filter((check) => !check.old))).data
    const transferResult = (await customAxios.post("/transfer", transfers.filter((transfer) => !transfer.old))).data

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

    const updateChecksResult = (await customAxios.put("/check", checks.filter((check) => check.old))).data
    const updateTransfersResult = (await customAxios.put("/transfer", transfers.filter((transfer) => transfer.old))).data

    data.checks = [...checksResult.payload.map((c, i) => c._id), ...updateChecksResult.payload.map((c, i) => c._id)]
    data.transfers = [...transferResult.payload.map((t, i) => t._id), ...updateTransfersResult.payload.map((t, i) => t._id)]
    data.materials = { material: data.materialsMaterial, amount: data.materialsAmount, date: data.materialsDate }
    const paymentResult = (await customAxios.put(`/white-payment/${sid}`, data)).data
    navigate(`/budgets/${payment?.budget?._id}/payments/${payment?._id}`)
  })

  const onSubmit = type == "a" ? whiteSubmit : blackSubmit

  const addArrayObj = (array = checks, setFunction = setChecks) => {
    if (accounts) {
      setFunction([...array, { id: (array[array.length - 1]?.id + 1) || 1, account: accounts[0]?.value }])
    }
  }

  console.log(subpayment)

  return (
    <Main className={"grid items-center gap-4 justify-center"} paddings>
      {(payment && payment != "error" && subpayment && subpayment != "error") ? (
        <>
          <Section className={"gap-x-[40px] items-center"}>
            <Link to={`/budgets/${bid}/payments/${pid}`}>
              <FaChevronLeft className="text-4xl" />
            </Link>
            <Title>Adelanto {moment.utc(subpayment?.date).format("DD-MM-YYYY")} - Pago {payment?.paymentNumber} - Presupuesto {payment?.budget?.title || payment?.budget?.supplier?.name}</Title>
          </Section>
          <Section style="form" className={"w-full"}>
            <Form onSubmit={onSubmit}>
              {type == "a" ? (
                <>
                  {payment?.white?.bills?.find((bill) => bill.concept == "certificate") &&
                    <>
                      <Input register={{ ...register("retention") }} defaultValue={subpayment?.retention?.amount} placeholder={"$"}>
                        <Label text={"Retencion:"} />
                      </Input>
                      <Input register={{ ...register("retentionNumber") }} defaultValue={subpayment?.retention?.code}>
                        <Label text={"Numero de retencion:"} />
                      </Input>
                    </>}
                  <Input className={"!w-full max-w-[250px]"} placeholder={"TOTAL"} register={{ ...register("materialsAmount") }} defaultValue={subpayment?.materials?.amount}>
                    <Label text={"Materiales"} name={"materialsAmount"} />
                    <Input placeholder={"Material"} register={{ ...register("materialsMaterial") }} className={"max-w-[300px]"} defaultValue={subpayment?.materials?.material} />
                    <Input type="date" register={{ ...register("materialsDate") }} defaultValue={moment.utc(subpayment?.materials?.date).format("YYYY-MM-DD")} />
                  </Input>

                  <h2 className="text-2xl md:text-4xl font-ubuntu">Cheques</h2>
                  <PaymentMethodForm paymentMethod={checks} setPaymentMethod={setChecks} payment={payment} sid={sid} accounts={accounts} />
                  <Button style="icon" className={"bg-success hover:!bg-green-600"} type="button" onClick={() => addArrayObj()}><FaPlus className="text-4xl cursor pointers" /></Button>

                  <h2 className="text-2xl md:text-4xl font-ubuntu border-t-4 pt-4">Transferencias</h2>
                  <PaymentMethodForm paymentMethod={transfers} setPaymentMethod={setTransfers} accounts={accounts} placeholder="transferencia" endpoint="transfer" expiration={false} />
                  <Button style="icon" className={"bg-success hover:!bg-green-600"} type="button" onClick={() => addArrayObj(transfers, setTransfers)}><FaPlus className="text-4xl cursor pointers" /></Button>
                </>
              ) : null}
              <Button className={"text-black"} type="submit" style="submit">Enter</Button>
            </Form>
          </Section>
        </>

      ) : (
        (!payment || !subpayment) ? <BounceLoader size={100} /> : <Title>ERROR</Title>
      )}
    </Main>
  )
}

export default EditSubpayment