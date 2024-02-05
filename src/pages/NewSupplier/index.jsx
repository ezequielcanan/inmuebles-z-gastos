import Form from "../../components/Form"
import Title from "../../components/Title"
import Main from "../../containers/Main"
import Input from "../../components/FormInput/Input"
import Button from "../../components/Button"
import customAxios from "../../config/axios.config.js"
import { useNavigate } from "react-router-dom"
import { FaHelmetSafety } from "react-icons/fa6"
import { useForm } from "react-hook-form"
import Label from "../../components/Label/index.jsx"

const NewSupplier = () => {
  const { register, handleSubmit } = useForm()
  const navigate = useNavigate()

  const onSubmit = handleSubmit(async data => {
    try {
      const res = (await customAxios.post("/supplier", data)).data
      res.payload && navigate("/suppliers")
    }
    catch (e) {
      console.log(e)
      navigate("/suppliers")
    }
  })

  return <Main className={"grid items-center justify-center gap-y-[30px] py-[30px] px-[10px] pt-[150px] xl:pt-[100px] xl:pl-[370px] xl:pr-[100px]"} >
    <section>
      <Title className="text-center">Nuevo proveedor</Title>
    </section>
    <section className="bg-secondary flex flex-col items-center gap-y-[70px] p-3 md:p-7 text-white">
      <FaHelmetSafety className="text-[100px] md:text-[180px]" />
      <Form className={""} onSubmit={onSubmit}>
        <Input register={{ ...register("name") }}>
          <Label name="name" text={"Razon social:"}/>
        </Input>
        <Input register={{ ...register("cuit") }}>
          <Label name="cuit" text={"CUIT:"}/>
        </Input>
        <Input register={{ ...register("email") }}>
          <Label name={"email"} text={"Email:"}/>
        </Input>
        <Input register={{ ...register("phone") }}>
          <Label name={"phone"} text={"Telefono:"}/>
        </Input>
        <Input register={{ ...register("address") }}>
          <Label name={"address"} text={"Direccion:"}/>
        </Input>
        <Input register={{ ...register("referrer") }}>
          <Label name={"referrer"} text={"Referente:"}/>
        </Input>
        <Button className="text-black" type="submit" style="submit">Añadir</Button>
      </Form>
    </section>
  </Main>
}

export default NewSupplier