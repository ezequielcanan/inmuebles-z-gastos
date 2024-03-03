import { MdAccountBalanceWallet } from "react-icons/md"
import Form from "../../components/Form"
import Title from "../../components/Title"
import Main from "../../containers/Main"
import Section from "../../containers/Section"
import Input from "../../components/FormInput/Input"
import { useForm } from "react-hook-form"
import Label from "../../components/Label"
import Button from "../../components/Button"
import customAxios from "../../config/axios.config"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import SelectInput from "../../components/FormInput/SelectInput"

const NewAccount = () => {
  const navigate = useNavigate()
  const { register, handleSubmit } = useForm()
  const [projects, setProjects] = useState(false)

  useEffect(() => {
    customAxios.get("/projects?filter=false").then(res => {
      setProjects(res?.data?.payload.map((project => {
        return { text: project.title, value: project._id }
      })) || [])
    }).catch(e => {
      setProjects([])
    })
  }, [])

  const onSubmit = handleSubmit(async data => {
    const result = (await customAxios.post("/account", data)).data
    navigate("/accounts")
  })

  return (
    <Main className={"grid items-center justify-center gap-y-[30px]"} paddings>
      <section>
        <Title className={"text-start md:text-center"}>
          Nueva cuenta bancaria
        </Title>
      </section>
      {projects ? <Section style="form">
        <MdAccountBalanceWallet className="text-[100px] md:text-[180px]" />
        <Form onSubmit={onSubmit}>
          <SelectInput register={{...register("society")}} options={projects}>
            <Label name={"society"} text={"Sociedad:"}/>
          </SelectInput>
          <Input register={{...register("cbu")}}>
            <Label name={"cbu"} text={"CBU:"}/>
          </Input>
          <Input register={{...register("alias")}}>
            <Label name={"alias"} text={"Alias:"}/>
          </Input>
          <Input register={{...register("cuit")}}>
            <Label name={"cuit"} text={"CUIT:"}/>
          </Input>
          <Input register={{...register("bank")}}>
            <Label name={"bank"} text={"Banco:"}/>
          </Input>
          <Input register={{...register("name")}}>
            <Label name={"name"} text={"Titular:"}/>
          </Input>
          <Button type="submit" style="submit" className={"text-black"}>
            Agregar Cuenta
          </Button>
        </Form>
      </Section> : null}
    </Main>
  )
}

export default NewAccount