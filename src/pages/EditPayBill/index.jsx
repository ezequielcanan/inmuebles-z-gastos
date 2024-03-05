import { Link, useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { FaPlus } from "react-icons/fa6"
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

const EditPayBill = () => {
  const { billId, pid, sid } = useParams()
  const { register, handleSubmit } = useForm()
  const [accounts, setAccounts] = useState(false)
  const [checks, setChecks] = useState([])
  const [transfers, setTransfers] = useState([])
  const [bill, setBill] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    customAxios.get(`/bill/${billId}`).then(res => {
      const resChecks = res?.data?.payload?.checks
      const resTransfers = res?.data?.payload?.transfers
      setChecks(resChecks.map((check, i) => {
        return { ...check, emissionDate: moment.utc(check.emissionDate).format("YYYY-MM-DD"), expirationDate: moment.utc(check.expirationDate).format("YYYY-MM-DD"), old: true, id: i }
      }))
      setTransfers(resTransfers.map((transfer, i) => {
        return { ...transfer, emissionDate: moment.utc(transfer.emissionDate).format("YYYY-MM-DD"), old: true, id: i }
      }))
      setBill(res?.data?.payload || {})
    }).catch(e => {
      setBill("error")
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


  const onSubmit = handleSubmit(async data => {
    data.date = data.date || moment()
    if (data?.retention) data.retention.detail = `Retencion N° ${data?.retention?.code}, factura ${bill?.code}, ${bill?.receiver?.name || ""} ${bill?.project?.title || ""}`

    const checksResult = (await customAxios.post("/check", checks.filter((check) => !check.old))).data
    const transferResult = (await customAxios.post("/transfer", transfers.filter((transfer) => !transfer.old))).data

    await Promise.all(checksResult?.payload?.map(async (check, i) => {
      if (checks[i].file) {
        const fileData = { folder: `projects/${bill?.project?._id}/supplier/${bill?.receiver?._id}/bill/${bill?._id}/checks/${check?._id}` }
        const formData = new FormData()
        formData.append("data", JSON.stringify(fileData))
        formData.append("file", checks[i].file)
        await customAxios.post(`/check/file`, formData, { headers: { "Content-Type": "multipart/form-data" } })
      }
    }))

    await Promise.all(transferResult?.payload?.map(async (transfer, i) => {
      if (transfers[i].file) {
        const fileData = { folder: `projects/${bill?.project?._id}/supplier/${bill?.receiver?._id}/bill/${bill?._id}/transfers/${transfer?._id}` }
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
    const result = (await customAxios.put(`/bill/${billId}`, data)).data
    navigate(`/projects/${bill?.project?._id}/${bill?.receiver?._id}/${billId}`)
  })


  const addArrayObj = (array = checks, setFunction = setChecks, type = "check") => {
    if (accounts && bill) {
      setFunction([...array, { id: (array[array.length - 1]?.id + 1) || 1, detail: `${type == "check" ? "Cheque" : "Transferencia"} factura ${bill?.code}, ${bill?.receiver?.name || ""} ${bill?.project?.title || ""}`, account: accounts[0]?.value }])
    }
  }

  return (
    <Main className={"grid items-center gap-4 justify-center"} paddings>
      {(bill && bill != "error" && Array?.isArray(accounts)) ? (
        <>
          <Section className={"gap-x-[40px] items-center"}>
            <Link to={`/projects/${pid}/${sid}/${billId}`}>
              <FaChevronLeft className="text-4xl" />
            </Link>
            <Title>Pago Factura {bill?.code}: {bill?.project?.title} - {bill?.receiver?.name}</Title>
          </Section>
          <Section style="form" className={"w-full"}>
            <Form onSubmit={onSubmit}>
              <Input type="date" containerClassName={"!w-full"} register={{ ...register("retention.date") }} defaultValue={moment.utc(bill?.retention?.date).format("YYYY-MM-DD")}>
                <Label name={"date"} text={"Fecha de retencion:"} />
              </Input>
              <Input register={{ ...register("retention.amount") }} placeholder={"$"} defaultValue={bill?.retention?.amount}>
                <Label text={"Retencion:"} />
              </Input>
              <Input register={{ ...register("retention.code") }} defaultValue={bill?.retention?.code}>
                <Label text={"Numero de retencion:"} />
              </Input>
              <SelectInput options={accounts} className={"!w-full"} register={{ ...register("retention.account") }} defaultValue={bill?.retention?.account || accounts[0]?._id}>
                <Label text={"Cuenta retencion:"} />
              </SelectInput>
              <h2 className="text-2xl md:text-4xl font-ubuntu">Cheques</h2>
              <PaymentMethodForm paymentMethod={checks} setPaymentMethod={setChecks} accounts={accounts} />
              <Button style="icon" className={"bg-success hover:!bg-green-600"} type="button" onClick={() => addArrayObj()}><FaPlus className="text-4xl cursor pointers" /></Button>

              <h2 className="text-2xl md:text-4xl font-ubuntu border-t-4 pt-4">Transferencias</h2>
              <PaymentMethodForm paymentMethod={transfers} setPaymentMethod={setTransfers} accounts={accounts} endpoint="transfer" placeholder="transferencia" expiration={false} />
              <Button style="icon" className={"bg-success hover:!bg-green-600"} type="button" onClick={() => addArrayObj(transfers, setTransfers, "transfer")}><FaPlus className="text-4xl cursor pointers" /></Button>
              <Button className={"text-black"} type="submit" style="submit">Enter</Button>
            </Form>
          </Section>
        </>
      ) : (
        !bill ? <BounceLoader size={100} /> : <Title>ERROR</Title>
      )}
    </Main>
  )
}

export default EditPayBill