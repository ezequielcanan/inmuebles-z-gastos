import { CiViewTable } from "react-icons/ci"
import { useNavigate } from "react-router-dom"
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
import { FaFileArrowUp, FaPlus } from "react-icons/fa6"
import { RiSubtractFill } from "react-icons/ri"
import Section from "../../containers/Section"

const NewBudget = () => {
  const { register, handleSubmit } = useForm()
  const [projects, setProjects] = useState(false)
  const [suppliers, setSuppliers] = useState(false)
  const [file, setFile] = useState(false)
  const [paymentType, setPaymentType] = useState("quotas")
  const [paidApartments, setPaidApartments] = useState([])
  const navigate = useNavigate()

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

  const onSubmit = handleSubmit(async data => {
    data.paidApartments = paidApartments
    data.booking = data.bookingMethod == "bookingMoney" ? data.booking : data.booking * data.total / 100
    const result = (await customAxios.post("/budget", data, { headers: { "Content-Type": "application/json" } })).data

    data.folder = `projects/${result?.payload?.project}/budgets/${result?.payload?._id}`
    const formData = new FormData()
    formData.append("data", JSON.stringify(data))
    formData.append("file", file)

    const fileResult = (await customAxios.post("/budget/file", formData, { headers: { "Content-Type": "multipart/form-data" } })).data
    navigate("/budgets")
  })

  const mapApartments = apartments => {
    return apartments.map((a, i) => {
      return {
        value: a?._id,
        text: a?.unit
      }
    })
  }

  const getPaidApartmentIndex = id => {
    return paidApartments.findIndex(a => a.id == id)
  }

  const onChangePropertiesApartment = (property, newValue, id) => {
    const updateIndex = getPaidApartmentIndex(id)
    const updateObject = {}
    updateObject[property] = newValue
    paidApartments[updateIndex] = { ...paidApartments[updateIndex], ...updateObject }
    setPaidApartments([...paidApartments])
  }

  const onChangeApartment = async (aid, id) => {
    const updateIndex = getPaidApartmentIndex(id)
    paidApartments[updateIndex] = { ...paidApartments[updateIndex], apartment: aid }
    setPaidApartments([...paidApartments])
  }

  const onChangeProject = async (pid, id) => {
    if (projects) {
      try {
        const apartments = (await customAxios.get(`/apartments/project/${pid}`))?.data?.payload
        const updateIndex = getPaidApartmentIndex(id)
        paidApartments[updateIndex] = { ...paidApartments[updateIndex], project: pid, id, apartment: apartments[0]?._id, apartments: mapApartments(apartments) }
        setPaidApartments([...paidApartments])
      }
      catch (e) {
        console.log(e)
      }
    }
  }

  const addApartment = async () => {
    if (projects) {
      try {
        const apartments = (await customAxios.get(`/apartments/project/${projects[0]?.value}`))?.data?.payload
        setPaidApartments([...paidApartments, { id: (paidApartments[paidApartments.length - 1]?.id + 1) || 1, project: projects[0]?.value, apartment: apartments[0]?._id, apartments: mapApartments(apartments), dollar: 0, total: 0, subtractType: "quota" }])
      }
      catch (e) {
        console.log(e)
      }
    }
  }

  const deleteApartment = async (id) => {
    const deleteIndex = getPaidApartmentIndex(id)
    paidApartments.splice(deleteIndex, 1)
    setPaidApartments([...paidApartments])
  }

  return (
    <Main className={"grid items-center justify-center py-[40px] gap-y-[30px]"} paddings>
      <section>
        <Title className={"text-center"}>
          Nuevo presupuesto
        </Title>
      </section>
      <Section style="form">
        {(projects && suppliers) ? (
          <>
            <CiViewTable className="text-[100px] md:text-[180px]" />
            <Form className={"grid 2xl:grid-cols-2 gap-8"} onSubmit={onSubmit}>
              <div className="flex flex-col gap-y-[20px]">
                <Input register={{ ...register("title") }} className={"md:!w-[300px]"}>
                  <Label name={"title"} text={"Titulo:"} />
                </Input>
                <SelectInput options={projects} register={{ ...register("project") }}>
                  <Label name={"project"} text={"Proyecto:"} />
                </SelectInput>
                <SelectInput options={suppliers} register={{ ...register("supplier") }}>
                  <Label name={"supplier"} text={"Proveedor:"} />
                </SelectInput>
                <SelectInput options={[{ value: "quotas", text: "En cuotas" }, { value: "advance", text: "Por avance" }]} register={{ ...register("paymentType") }} onChange={(e) => setPaymentType(e.currentTarget?.value)}>
                  <Label name={"paymentType"} text={"Tipo de pago:"} />
                </SelectInput>
                {paymentType == "quotas" ? (
                  <Input register={{ ...register("quotas") }} type="number" className={"md:!w-[300px]"}>
                    <Label name={"quotas"} text={"Cuotas:"} />
                  </Input>
                ) : null}
                <Input register={{ ...register("total") }} type="number" className={"md:!w-[300px]"}>
                  <Label name={"total"} text={"TOTAL $:"} />
                </Input>
                <Input register={{ ...register("percentage") }} type="number" className={"!w-[100px]"}>
                  <Label name={"percentage"} text={"Porcentaje A:"} />
                </Input>
                <Input register={{ ...register("code") }} type="number" className={"!w-full"}>
                  <Label name={"code"} text={"N° de presupuesto:"} />
                </Input>
                <Input register={{ ...register("date") }} type="date" className={"!w-full"}>
                  <Label name={"date"} text={"Fecha de presupuesto:"} />
                </Input>
                <Input type="file" className={"hidden"} register={{ ...register("file") }} id="file" onChange={(e) => setFile(e.target.files[0])}>
                  <p className="font-ubuntu md:text-4xl">Documento</p>
                  <Label name={"file"} className={"py-4 px-4 flex w-full justify-end cursor-pointer text-center"}>
                    {!file ? <FaFileArrowUp /> : <p className="py-3 px-3 max-w-[200px] overflow-hidden bg-primary">{file.name}</p>}
                  </Label>
                </Input>
              </div>
              <div className="flex flex-col gap-y-[20px]">
                <Input register={{ ...register("baseIndex") }} type="number" className={"md:!w-[300px]"}>
                  <Label name={"baseIndex"} text={"Indice base:"} />
                </Input>
                <Input register={{ ...register("dollarPrice") }} type="number" className={"md:!w-[300px]"}>
                  <Label name={"dollarPrice"} text={"Precio del dolar:"} />
                </Input>
                <Input register={{ ...register("booking") }} type="number" containerClassName={"!w-full"} className={"md:!w-full"}>
                  <Label name={"booking"} text={"Adelanto:"} />
                  <SelectInput register={{...register("bookingMethod")}} containerClassName={"!border-b-0"} options={[{text: "En porcentaje", value: "bookingPercentage"}, {text: "En dinero", value: "bookingMoney"}]}/>
                </Input>
                <h2 className="text-2xl md:text-4xl font-ubuntu">Departamentos en pago</h2>
                <div className="flex flex-col gap-y-[70px]">
                  {paidApartments.map((apartment, i) => {
                    return <div className="flex flex-col gap-y-[20px] items-start h-auto" key={i}>
                      <div className="flex items-center justify-between w-full">
                        <Button style="icon" type="button" onClick={() => deleteApartment(apartment.id)} className={"!bg-red-500 h-[50px]"}>
                          <RiSubtractFill size={100} />
                        </Button>
                        <SelectInput options={[{ value: "quota", text: "Por cuota" }, { value: "total", text: "Al total" }]} value={apartment?.subtractType} className={"w-full"} onChange={(e) => onChangePropertiesApartment("subtractType", e?.currentTarget?.value, apartment?.id)} />
                        <SelectInput options={apartment?.apartments} className={"w-full"} value={apartment?.apartment} onChange={(e) => onChangeApartment(e?.currentTarget?.value, apartment?.id)} />
                        <SelectInput options={projects} className={"w-full"} value={apartment?.project} onChange={(e) => onChangeProject(e?.currentTarget?.value, apartment?.id)} />
                      </div>
                      <div className="flex items-center justify-end w-full gap-x-4">
                        <Input placeholder={"Equivalente a:"} type="number" value={apartment?.total || ""} onChange={(e) => onChangePropertiesApartment("total", Number(e.currentTarget?.value), apartment.id)} className={"!w-full"} />
                        <Input placeholder={"Valor USD"} type="number" value={apartment?.dollar || ""} className={"!w-full"} onChange={(e) => onChangePropertiesApartment("dollar", Number(e.currentTarget?.value), apartment.id)} />
                      </div>
                    </div>
                  })}
                </div>
                <Button style="icon" className={"bg-success hover:!bg-green-600"} type="button" onClick={addApartment}><FaPlus className="text-4xl cursor pointers" /></Button>
                <Button type="submit" style="submit" className={"text-black"}>Crear Presupuesto</Button>
              </div>
            </Form>
          </>
        ) : <BounceLoader size={100} />}
      </Section>
    </Main>
  )
}

export default NewBudget