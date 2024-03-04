import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { BounceLoader } from "react-spinners"
import Main from "../../containers/Main"
import Title from "../../components/Title"
import Section from "../../containers/Section"
import customAxios from "../../config/axios.config"
import Subtitle from "../../components/Subtitle"
import Button from "../../components/Button"
import { FaEdit, FaPlus } from "react-icons/fa"
import MovementRow from "../../components/MovementRow"
import Input from "../../components/FormInput/Input"
import Label from "../../components/Label"
import { useForm } from "react-hook-form"
import SelectInput from "../../components/FormInput/SelectInput"
import Form from "../../components/Form"

const Account = () => {
  const { aid } = useParams()
  const [account, setAccount] = useState(false)
  const [movements, setMovements] = useState([])
  const [filter, setFilter] = useState(false)
  const [projects, setProjects] = useState(false)
  const [editing, setEditing] = useState(false)
  const [reload, setReload] = useState(false)

  const { register, handleSubmit } = useForm()

  useEffect(() => {
    customAxios.get("/projects?filter=false").then(res => {
      setProjects(res?.data?.payload.map((project => {
        return { text: project.title, value: project._id }
      })) || [])
    }).catch(e => {
      setProjects([])
    })
  }, [reload])

  useEffect(() => {
    customAxios.get(`/account/${aid}`).then(res => {
      setAccount(res?.data?.payload)
    })
  }, [reload])

  useEffect(() => {
    customAxios.get(`/movement/${aid}?filter=${filter}`).then(res => setMovements(res?.data?.payload))
  }, [filter, reload])

  const onSubmit = handleSubmit(async data => {
    await customAxios.put(`/account/${aid}`, data)
    setEditing(false)
    setReload(!reload)
  })
  
  let lastRow = {}


  return (
    <Main className={"flex flex-col gap-y-[20px] pb-[120px]"} paddings>
      {(account && account != "error" && projects) ? (
        <>
          <Section className={"flex gap-x-[40px] items-center"}>
            <Title>Banco {account.bank} {account.society?.title}</Title>
            <FaEdit className="text-5xl cursor-pointer" onClick={() => setEditing(!editing)} />
          </Section>
          <section className="flex flex-col items-start gap-y-[10px] text-xl">
            <Form onSubmit={onSubmit}>
              <SelectInput register={{ ...register("society") }} defaultValue={account?.society?._id} options={projects} disabled={!editing} optionClassName={"text-white"} containerClassName={"!border-b-0 !w-full !justify-start"} className={"!text-2xl"}>
                <Label text={"Sociedad:"} name={"society"} className={"!text-2xl"} />
              </SelectInput>
              <Input register={{ ...register("cuit") }} defaultValue={account?.cuit} disabled={!editing} containerClassName={"!border-b-0 !w-full !justify-start"} className={"!text-2xl"}>
                <Label text={"CUIT:"} name={"cuit"} className={"!text-2xl"} />
              </Input>
              <Input register={{ ...register("cbu") }} defaultValue={account?.cbu} disabled={!editing} containerClassName={"!border-b-0 !w-full !justify-start"} className={"!text-2xl"}>
                <Label text={"CBU:"} name={"cbu"} className={"!text-2xl"} />
              </Input>
              <Input register={{ ...register("alias") }} defaultValue={account?.alias} disabled={!editing} containerClassName={"!border-b-0 !w-full !justify-start"} className={"!text-2xl"}>
                <Label text={"Alias:"} name={"alias"} className={"!text-2xl"} />
              </Input>
              <Input register={{ ...register("name") }} defaultValue={account?.name} disabled={!editing} containerClassName={"!border-b-0 !w-full !justify-start"} className={"!text-2xl"}>
                <Label text={"Titular"} name={"name"} className={"!text-2xl"} />
              </Input>
              {editing && <Button style="submit" type="submit" className={"!text-xl self-start border-4 border-black"}>
                Actualizar cuenta
              </Button>}
            </Form>
          </section>
          <section className="flex flex-col items-start gap-y-[30px] pt-[60px]">
            <div className="flex w-full gap-8 items-center flex-col sm:flex-row justify-between">
              <Subtitle>Movimientos</Subtitle>
              <Link to={`/accounts/${aid}/new-movement`}>
                <Button className={"flex"}>
                  Agregar movimiento <FaPlus />
                </Button>
              </Link>
            </div>
            <div className="overflow-x-auto w-full flex flex-col gap-y-[30px]">
              <Button className="self-start bg-third hover:after:!left-[-100%] !text-black border-2 border-black" onClick={() => setFilter(!filter)}>Ordenado por: {filter ? "Vencimiento" : "Emisión"}</Button>
              <table className="w-full border-4 border-b-0 border-secondary">
                <thead className="w-full border-b-4 border-secondary">
                  <tr>
                    <th className="text-start p-3 whitespace-nowrap bg-secondary text-2xl text-white">Emisión</th>
                    <th className="text-start p-3 whitespace-nowrap bg-secondary text-2xl text-white">Vencimiento</th>
                    <th className="text-start p-3 whitespace-nowrap bg-secondary text-2xl text-white">N° cheque</th>
                    <th className="text-start p-3 whitespace-nowrap bg-secondary text-2xl text-white">Detalle</th>
                    <th className="text-start p-3 whitespace-nowrap bg-secondary text-2xl text-white">Credito</th>
                    <th className="text-start p-3 whitespace-nowrap bg-secondary text-2xl text-white">Debito</th>
                    <th className="text-start p-3 whitespace-nowrap bg-secondary text-2xl text-white">Brutos</th>
                    <th className="text-start p-3 whitespace-nowrap bg-secondary text-2xl text-white">6XMIL</th>
                    <th className="text-start p-3 whitespace-nowrap bg-secondary text-2xl text-white">Saldo</th>
                  </tr>
                </thead>
                <tbody>
                  {movements.map((movement) => {
                    lastRow = { ...movement }
                    return <MovementRow movement={movement} key={movement?._id} />
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : (
        !account ? <BounceLoader size={100} /> : <Title>ERROR</Title>
      )}
    </Main>
  )
}

export default Account