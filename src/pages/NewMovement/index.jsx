import { useNavigate, useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import Main from "../../containers/Main"
import Section from "../../containers/Section"
import Form from "../../components/Form"
import Input from "../../components/FormInput/Input"
import Label from "../../components/Label"
import Button from "../../components/Button"
import Title from "../../components/Title"
import customAxios from "../../config/axios.config"

const NewMovement = () => {
  const navigate = useNavigate()
  const {aid} = useParams()
  const {register, handleSubmit} = useForm()

  const onSubmit = handleSubmit(async data => {
    data.account = aid
    await customAxios.post("/movement", data)
    navigate(`/accounts/${aid}`)
  })

  return (
    <Main className={"grid items-center justify-center gap-y-[30px]"} paddings>
      <section>
        <Title className={"text-start md:text-center"}>
          Nuevo movimiento bancario
        </Title>
      </section>
      <Section style="form">
        <Form onSubmit={onSubmit}>
          <Input register={{...register("date", {required: true})}} type="date">
            <Label name={"date"} text={"Fecha:"}/>
          </Input>
          <Input register={{...register("checkCode")}}>
            <Label name={"checkCode"} text={"N° de cheque:"}/>
          </Input>
          <Input register={{...register("detail", {required: true})}}>
            <Label name={"detail"} text={"Detalle:"}/>
          </Input>
          <Input register={{...register("credit")}}>
            <Label name={"credit"} text={"Credito:"}/>
          </Input>
          <Input register={{...register("debit")}}>
            <Label name={"debit"} text={"Debito:"}/>
          </Input>
          <Input register={{...register("tax")}} placeholder={"%"}>
            <Label name={"tax"} text={"Ingresos brutos:"}/>
          </Input>
          <Button type="submit" style="submit" className={"text-black"}>
            Agregar Movimiento
          </Button>
        </Form>
      </Section>
    </Main>
  )
}

export default NewMovement