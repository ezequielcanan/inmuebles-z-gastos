import { GiMoneyStack } from "react-icons/gi"
import Form from "../../components/Form"
import Input from "../../components/FormInput/Input"
import SelectInput from "../../components/FormInput/SelectInput"
import Label from "../../components/Label"
import Title from "../../components/Title"
import Main from "../../containers/Main"
import { BounceLoader } from "react-spinners"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import customAxios from "../../config/axios.config"
import Button from "../../components/Button"
import { FaPlus } from "react-icons/fa6"
import { RiSubtractFill } from "react-icons/ri"

const NewBudget = () => {
  const { register, handleSubmit } = useForm()
  const [projects, setProjects] = useState(false)
  const [suppliers, setSuppliers] = useState(false)
  const [paidApartments, setPaidApartments] = useState(0)
  const [paidApartmentsNumber, setPaidApartmentsNumber] = useState(1)

  useEffect(() => {
    customAxios.get("/projects?filter=false").then(res => {
      setProjects(res?.data?.payload.map((project => {
        return { text: project.title, value: project._id }
      })) || [])
    }).catch(e => {
      setProjects([])
    })
  }, [])

  useEffect(() => {
    customAxios.get("/supplier").then(res => {
      setSuppliers(res?.data?.payload.map((supplier => {
        return { text: supplier.name, value: supplier._id }
      })) || [])
    }).catch(e => {
      setSuppliers([])
    })
  }, [])
  return (
    <Main className={"grid items-center justify-center py-[40px] gap-y-[30px]"} paddings>
      <section>
        <Title className={"text-center"}>
          Nuevo presupuesto
        </Title>
      </section>
      <section className="bg-secondary flex flex-col items-center gap-y-[70px] p-3 md:p-7 text-white">
        {(projects && suppliers) ? (
          <>
            <GiMoneyStack className="text-[100px] md:text-[180px]" />
            <Form className={"grid 2xl:grid-cols-2 gap-8"}>
              <div className="flex flex-col gap-y-[20px]">
                <SelectInput options={projects} {...register("project")}>
                  <Label name={"project"} text={"Proyecto:"} />
                </SelectInput>
                <SelectInput options={suppliers} register={{ ...register("supplier") }}>
                  <Label name={"supplier"} text={"Proveedor:"} />
                </SelectInput>
                <SelectInput options={[{ value: "quotas", text: "En cuotas" }, { value: "advance", text: "Por avance" }]} register={{ ...register("paymentType") }}>
                  <Label name={"paymentType"} text={"Tipo de pago:"} />
                </SelectInput>
                <Input register={{ ...register("total") }} type="number" className={"md:!w-[300px]"}>
                  <Label name={"total"} text={"TOTAL $:"} />
                </Input>
                <Input register={{ ...register("percentage") }} type="number" className={"!w-[100px]"}>
                  <Label name={"percentage"} text={"Porcentaje A:"} />
                </Input>
                <Input register={{ ...register("code") }} type="number" className={"!w-full"}>
                  <Label name={"code"} text={"N° de presupuesto:"} className={"shrink"}/>
                </Input>
              </div>
              <div className="flex flex-col gap-y-[20px]">
                <Input register={{ ...register("baseIndex") }} type="number" className={"md:!w-[300px]"}>
                  <Label name={"baseIndex"} text={"Indice base:"} />
                </Input>
                <Input register={{ ...register("dollarPrice") }} type="number" className={"md:!w-[300px]"}>
                  <Label name={"dollarPrice"} text={"Precio del dolar:"} />
                </Input>
                <Input register={{ ...register("booking") }} type="number" className={"md:!w-[300px]"}>
                  <Label name={"booking"} text={"Adelanto:"} />
                </Input>
                <h2 className="text-4xl font-ubuntu">Departamentos en pago</h2>
                {[...Array(paidApartmentsNumber).keys()].map((apartment, i) => {
                  return <div className="flex items-start justify-between h-auto">
                    <Button style="icon" className={"bg-red-500 h-[50px]"}>
                      <RiSubtractFill size={100}/>
                    </Button>
                    <SelectInput options={projects} {...register("project")} />
                  </div>
                })}
                <Button style="icon" className={"bg-success hover:bg-green-600"} onClick={() => setPaidApartmentsNumber(prev => prev += 1)}><FaPlus className="text-4xl cursor pointers" /></Button>
                <Button type="submit" style="submit" className={"text-black"}>Crear Presupuesto</Button>
              </div>
            </Form>
          </>
        ) : <BounceLoader size={100} />}
      </section>
    </Main>
  )
}

export default NewBudget