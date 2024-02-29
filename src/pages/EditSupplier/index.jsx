import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { BounceLoader } from "react-spinners"
import { FaHelmetSafety } from "react-icons/fa6"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import Form from "../../components/Form"
import Title from "../../components/Title"
import Main from "../../containers/Main"
import Input from "../../components/FormInput/Input"
import Button from "../../components/Button"
import customAxios from "../../config/axios.config.js"
import Label from "../../components/Label/index.jsx"
import Section from "../../containers/Section/index.jsx"

const EditSupplier = () => {
  const navigate = useNavigate()
  const { sid } = useParams()
  const { register, handleSubmit } = useForm()
  const [supplier, setSupplier] = useState(false)

  useEffect(() => {
    customAxios.get(`/supplier/${sid}`).then((res) => {
      setSupplier(res.data?.payload)
    }).catch(e => setSupplier("error"))
  })


  const onSubmit = handleSubmit(async data => {
    try {
      const res = (await customAxios.put(`/supplier/${sid}`, data)).data
      res.payload && navigate("/suppliers")
    }
    catch (e) {
      console.log(e)
      navigate("/suppliers")
    }
  })

  return (
    <Main className={"grid items-center pb-[100px] justify-center gap-y-[30px]"} paddings>
      <section>
        <Title className="text-center">Editar proveedor</Title>
      </section>
      {(supplier && supplier != "error") ? (
        <Section style="form">
          <FaHelmetSafety className="text-[100px] md:text-[180px]" />
          <Form className={""} onSubmit={onSubmit}>
            <Input register={{ ...register("name") }} defaultValue={supplier?.name}>
              <Label name="name" text={"Razon social:"} />
            </Input>
            <Input register={{ ...register("cuit") }} defaultValue={supplier?.cuit}>
              <Label name="cuit" text={"CUIT:"} />
            </Input>
            <Input register={{ ...register("email") }} defaultValue={supplier?.email}>
              <Label name={"email"} text={"Email:"} />
            </Input>
            <Input register={{ ...register("phone") }} defaultValue={supplier?.phone}>
              <Label name={"phone"} text={"Telefono:"} />
            </Input>
            <Input register={{ ...register("address") }} defaultValue={supplier?.address}>
              <Label name={"address"} text={"Direccion:"} />
            </Input>
            <Input register={{ ...register("referrer") }} defaultValue={supplier?.referrer}>
              <Label name={"referrer"} text={"Referente:"} />
            </Input>
            <Button className="text-black" type="submit" style="submit">Actualizar</Button>
          </Form>
        </Section>
      ) : (
        supplier == "error" ? <p>Error en el servidor</p> : <BounceLoader />
      )}
    </Main>
  )
}

export default EditSupplier