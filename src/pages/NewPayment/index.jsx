import { useEffect, useState } from "react"
import { BounceLoader } from "react-spinners"
import { Link, useNavigate, useParams } from "react-router-dom"
import { GiMoneyStack } from "react-icons/gi"
import { useForm } from "react-hook-form"
import { FaFileArrowUp } from "react-icons/fa6"
import moment from "moment"
import Title from "../../components/Title"
import Subtitle from "../../components/Subtitle"
import SelectInput from "../../components/FormInput/SelectInput"
import Main from "../../containers/Main"
import Section from "../../containers/Section"
import customAxios from "../../config/axios.config"
import Form from "../../components/Form"
import Input from "../../components/FormInput/Input"
import Label from "../../components/Label"
import Button from "../../components/Button"
import axios from "axios"
import { FaChevronLeft } from "react-icons/fa"

const NewPayment = () => {
  const { bid } = useParams()
  const { register, handleSubmit } = useForm()
  const [budget, setBudget] = useState()
  const [files, setFiles] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    customAxios.get(`/budget/${bid}`).then(res => {
      setBudget(res?.data?.payload || {})
    }).catch(e => {
      setBudget("error")
    })
  }, [])

  const onSubmit = handleSubmit(async data => {
    data.percentageOfTotal = data.advanceMethod == "percentage" ? (data.percentageOfTotal || ((budget?.total / budget?.quotas) * 100 / budget?.total)) : (data.percentageOfTotal * 100 / budget?.total)
    data.amount = budget?.total * data?.percentageOfTotal / 100
    data.discountByApartments = budget?.paidApartments?.reduce((acc, apartment) => apartment.discount == "quota" ? acc + (apartment?.apartment?.total * apartment?.apartment?.dolar) * data.percentageOfTotal / 100 : acc, 0)
    if (!data.indexCac) {
      const cacHistory = (await axios.get("https://prestamos.ikiwi.net.ar/api/cacs")).data
      data.indexCac = cacHistory[cacHistory.length - 1]?.general
    }

    data.total = data.amount

    data.white = { amount: data.total * budget?.percentage / 100, mcp: ((data.indexCac / budget?.baseIndex) - 1) * (data.total * budget?.percentage / 100) }
    data.black = { amount: data.total * (100 - budget?.percentage) / 100, mcp: ((data.indexCac / budget?.baseIndex) - 1) * (data.total * (100 - budget?.percentage) / 100) }
    data.budget = budget?._id
    data.budget = budget

    data.paymentNumber = (budget?.lastPayment?.paymentNumber + 1) || 1

    const result = (await customAxios.post("/payment", data)).data
    const updateResult = (await customAxios.put(`/budget/${budget?._id}`, { lastPayment: result?.payload?._id, advanced: budget?.advanced + data.total })).data
    data.folder = `projects/${budget?.project?._id}/budgets/${result?.payload?.budget}/payments/${result?.payload?._id}`

    const formData = new FormData()
    formData.append("data", JSON.stringify(data))
    Object.values(files).forEach((file) => {
      formData.append("files", file)
    })

    const fileResult = (await customAxios.post(`/payment/files`, formData, { headers: { "Content-Type": "multipart/form-data" } })).data
    navigate(`/budgets/${budget?._id}`)
  })


  return (
    <Main className={"grid items-center justify-items-center gap-y-[30px] py-[100px]"} paddings>
      {budget && budget != "error" ? (
        <>
          <Section className={"!flex-col"}>
            <div className="flex items-center gap-x-[40px]">
              <Link to={`/budgets/${bid}`}>
                <FaChevronLeft className="text-4xl" />
              </Link>
              <Title className={"text-center xl:text-start"}>
                Presupuesto {budget?.code || moment.utc(budget?.date).format("YYYY-MM-DD")}: {budget?.supplier?.name} - {budget?.project?.title}
              </Title>
            </div>
            <Subtitle className={"md:text-5xl"}>
              Nuevo pago
            </Subtitle>
          </Section>
          <Section style="form">
            <GiMoneyStack className="text-[100px] md:text-[180px]" />
            <Form onSubmit={onSubmit}>
              {budget?.paymentType == "advance" ? (
                <Input type="number" className="!max-w-[300px]" register={{ ...register("percentageOfTotal", { required: true }) }}>
                  <Label name={"percentageOfTotal"} text={"Avance:"} />
                  <SelectInput register={{ ...register("advanceMethod") }} options={[{ text: "%", value: "percentage" }, { text: "$", value: "money" }]} />
                </Input>
              ) : null}
              <Input placeholder={"Ultimo cac"} type="number" register={{ ...register("indexCac") }}>
                <Label name={"indexCac"} text={"Indice CAC:"} />
              </Input>
              <Input placeholder={"%"} type="number" register={{ ...register("balanceAdjustment") }}>
                <Label name={"balanceAdjustment"} text={"Ajuste saldo pendiente:"} />
              </Input>
              <Input type="file" className={"hidden"} id="file" multiple="multiple" onChange={(e) => setFiles(e.target?.files)}>
                <p className="font-ubuntu md:text-4xl">Archivos</p>
                <Label name={"file"} className={"py-4 px-4 flex w-full justify-end cursor-pointer text-center"}>
                  {!files ? <FaFileArrowUp /> : <p className="py-3 px-3 max-w-[200px] overflow-hidden bg-primary">{files.length} archivo/s</p>}
                </Label>
              </Input>
              <Button type="submit" style="submit" className={"text-black"}>
                Ingresar pago
              </Button>
            </Form>
          </Section>
        </>
      ) : (
        !budget ? <BounceLoader size={100} /> : <Title>ERROR</Title>
      )}
    </Main>
  )
}

export default NewPayment