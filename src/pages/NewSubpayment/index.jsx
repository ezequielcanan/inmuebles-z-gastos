import { useParams } from "react-router-dom"
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

const NewSubpayment = () => {
  const { pid, bid, type } = useParams()
  const { register, handleSubmit } = useForm()
  const [accounts, setAccounts] = useState([])
  const [payment, setPayment] = useState()
  const [checks, setChecks] = useState([])
  const [transfers, setTransfers] = useState([])

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

  const onSubmit = handleSubmit(async data => {
    data.cashPaid = { total: data.cashPaid || 0, account: data.account }
    data.date = moment()
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
    const paymentResult = (await customAxios.post(`/white-payment/${pid}`, data)).data
  })

  const arrayIndex = (id, array = checks) => {
    return array.findIndex(a => a.id == id)
  }

  const onChangePropertiesState = (property, newValue, id, array = checks, setFunction = setChecks) => {
    const updateIndex = arrayIndex(id, array)
    const updateObject = {}
    updateObject[property] = newValue
    array[updateIndex] = { ...array[updateIndex], ...updateObject }
    setFunction([...array])
  }

  const deleteArrayObj = (id, array = checks, setFunction = setChecks) => {
    const deleteIndex = arrayIndex(id, array)
    array.splice(deleteIndex, 1)
    setFunction([...array])
  }

  const addArrayObj = (array = checks, setFunction = setChecks) => {
    if (accounts) {
      setFunction([...array, { id: (array[array.length - 1]?.id + 1) || 1, account: accounts[0]?.value }])
    }
  }

  return (
    <Main className={"grid items-center gap-4 justify-center"} paddings>
      {(payment && payment != "error") ? (
        <>
          <Section>
            <Title>Adelanto {type.toUpperCase()} - Pago {payment?.paymentNumber} - Presupuesto {payment?.budget?.title || payment?.budget?.supplier?.name}</Title>
          </Section>
          <Section style="form" className={"w-full"}>
            <Form onSubmit={onSubmit}>
              {type == "a" &&
                <>
                  {payment?.white?.bills?.find((bill) => bill.concept == "certificate") &&
                    <>
                      <Input register={{ ...register("retention") }} placeholder={"%"}>
                        <Label text={"Retencion:"} />
                      </Input>
                      <Input register={{ ...register("retentionNumber") }}>
                        <Label text={"Numero de retencion:"} />
                      </Input>
                    </>}
                  <h2 className="text-2xl md:text-4xl font-ubuntu">Cheques</h2>
                  <div className="flex flex-col gap-y-[70px]">
                    {checks.map((check, i) => {
                      return <div className="flex flex-col gap-y-[20px] items-start h-auto" key={check.id}>
                        <div className="flex items-center gap-8 justify-between w-full">
                          <Button style="icon" type="button" className={"!bg-red-500 h-[50px]"} onClick={() => deleteArrayObj(check.id)}>
                            <RiSubtractFill size={100} />
                          </Button>
                          <Input className={"!w-full max-w-[250px]"} placeholder={"N° de cheque"} value={check?.code} onChange={e => onChangePropertiesState("code", e?.currentTarget?.value, check?.id)} />
                          <Input type="number" className={"!w-full max-w-[250px]"} value={check?.amount} placeholder={"Monto"} onChange={e => onChangePropertiesState("amount", e?.currentTarget?.value, check?.id)} />
                          <SelectInput options={accounts} className={"!w-full"} value={check?.account} onChange={(e) => onChangePropertiesState("account", e?.currentTarget?.value, check?.id)} />
                        </div>
                        <div className="flex items-center justify-end w-full gap-x-4">
                          <Input type="date" containerClassName={"!w-full grid"} value={check?.emissionDate} onChange={e => onChangePropertiesState("emissionDate", e?.currentTarget?.value, check?.id)}>
                            <Label name={"date"} text={"Emision:"} />
                          </Input>
                          <Input type="date" containerClassName={"!w-full grid"} value={check?.expirationDate} onChange={e => onChangePropertiesState("expirationDate", e?.currentTarget?.value, check?.id)}>
                            <Label name={"date"} text={"Vencimiento:"} />
                          </Input>
                          <Input type="file" className={"hidden"} containerClassName={"self-end"} id={"file" + check?.id} onChange={(e) => onChangePropertiesState("file", e?.target?.files[0], check?.id)}>
                            <p className="font-ubuntu md:text-4xl">Documento</p>
                            <Label name={"file" + check?.id} className={"py-4 px-4 flex w-full justify-end cursor-pointer text-center"}>
                              {!check?.file ? <FaFileArrowUp /> : <p className="py-3 px-3 max-w-[200px] overflow-hidden bg-primary">{check?.file?.name && "Archivo"}</p>}
                            </Label>
                          </Input>
                        </div>
                      </div>
                    })}
                  </div>
                  <Button style="icon" className={"bg-success hover:!bg-green-600"} type="button" onClick={() => addArrayObj()}><FaPlus className="text-4xl cursor pointers" /></Button>
                  <h2 className="text-2xl md:text-4xl font-ubuntu border-t-4 pt-4">Transferencias</h2>
                  <div className="flex flex-col gap-y-[70px]">
                    {transfers.map((transfer, i) => {
                      return <div className="flex flex-col gap-y-[20px] items-start h-auto" key={transfer.id}>
                        <div className="flex items-center gap-8 justify-between w-full">
                          <Button style="icon" type="button" className={"!bg-red-500 h-[50px]"} onClick={() => deleteArrayObj(transfer.id, transfers, setTransfers)}>
                            <RiSubtractFill size={100} />
                          </Button>
                          <Input className={"!w-full max-w-[250px]"} placeholder={"N° de transferencia"} value={transfer?.code} onChange={e => onChangePropertiesState("code", e?.currentTarget?.value, transfer?.id, transfers, setTransfers)} />
                          <Input type="number" className={"!w-full max-w-[250px]"} value={transfer?.amount} placeholder={"Monto"} onChange={e => onChangePropertiesState("amount", e?.currentTarget?.value, transfer?.id, transfers, setTransfers)} />
                          <SelectInput options={accounts} className={"!w-full"} value={transfer?.account} onChange={(e) => onChangePropertiesState("account", e?.currentTarget?.value, transfer?.id, transfers, setTransfers)} />
                        </div>
                        <div className="flex items-center justify-end w-full gap-x-4">
                          <Input type="date" containerClassName={"!w-full"} value={transfer?.emissionDate} onChange={e => onChangePropertiesState("emissionDate", e?.currentTarget?.value, transfer?.id, transfers, setTransfers)}>
                            <Label name={"date"} text={"Emision:"} />
                          </Input>
                          <Input type="file" className={"hidden"} containerClassName={"self-end"} id={"file" + transfer?.id + "transfer"} onChange={(e) => onChangePropertiesState("file", e?.target?.files[0], transfer?.id, transfers, setTransfers)}>
                            <p className="font-ubuntu md:text-4xl">Documento</p>
                            <Label name={"file" + transfer?.id + "transfer"} className={"py-4 px-4 flex w-full justify-end cursor-pointer text-center"}>
                              {!transfer?.file ? <FaFileArrowUp /> : <p className="py-3 px-3 max-w-[200px] overflow-hidden bg-primary">{transfer?.file?.name && "Archivo"}</p>}
                            </Label>
                          </Input>
                        </div>
                      </div>
                    })}
                  </div>
                  <Button style="icon" className={"bg-success hover:!bg-green-600"} type="button" onClick={() => addArrayObj(transfers, setTransfers)}><FaPlus className="text-4xl cursor pointers" /></Button>
                </>
              }
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