import { useParams, Link } from "react-router-dom"
import Main from "../../containers/Main"
import Title from "../../components/Title"
import { useEffect, useState } from "react"
import { BounceLoader } from "react-spinners"
import customAxios from "../../config/axios.config"
import { Fa0, FaChevronDown, FaChevronLeft } from "react-icons/fa6"
import Section from "../../containers/Section"
import BudgetCard from "../../components/BudgetCard"
import SupplierCard from "../../components/SupplierCard"
import Subtitle from "../../components/Subtitle"
import BackHeader from "../../components/BackHeader"

const Project = ({ title = "", backPath = "/projects", firstBackPath = {path: "/projects", name: "Proyectos"}, path = "projects" }) => {
  const { pid } = useParams()
  const [project, setProject] = useState()
  const [suppliers, setSuppliers] = useState()
  const [show, setShow] = useState(false)

  useEffect(() => {
    customAxios.get(`/projects/${pid}`).then(res => {
      setProject(res?.data?.payload || "error")
    }).catch(e => {
      setProject("error")
    })
  }, [])

  useEffect(() => {
    customAxios.get(`/supplier?pid=${pid}`).then(res => {
      setSuppliers(res?.data?.payload?.sort((a,b) => a?.name?.toLowerCase() > b?.name?.toLowerCase() ? 1 : (a?.name?.toLowerCase() < b?.name?.toLowerCase() ? -1 : 0)))
    })
  }, [])

  return (
    <Main className={"flex flex-col pt-[150px] gap-y-[50px] px-[10px] xl:pt-[100px] xl:pl-[370px] xl:pr-[100px]"}>
      <BackHeader backpath={backPath} condition={(project)} paths={[firstBackPath, {name: project?.title, path: `/projects/${pid}`}]}/> 
      {project ? (
        project != "error" ? (
          <>
            <Section>
              <Title>{title}{project.title}</Title>
            </Section>
            <section className="grid gap-8 justify-items-center xl:justify-items-start md:grid-cols-3">
              {suppliers?.length ? suppliers?.filter(s => s.budgets)?.map((supplier) => {
                return <SupplierCard key={supplier?._id} title={supplier?.name} referrer={supplier?.referrer} budgets={supplier?.budgets} path={`/${path}/${pid}/${supplier?._id}`} id={supplier?._id} />
              }) : <h2>No hay proveedores de este proyecto</h2>}
            </section>
            <section className={"flex flex-col gap-y-[30px] items-start"}>
              {suppliers?.filter(s => !s.budgets) ? <Subtitle onClick={() => setShow(!show)} className={"text-xl cursor-pointer flex items-center gap-4"}>Otros proovedores <FaChevronDown /></Subtitle> : null}
              <div className="grid gap-8 justify-items-center xl:justify-items-start md:grid-cols-3">
                {(suppliers?.length && show) ? suppliers?.filter(s => !s.budgets)?.map((supplier) => {
                  return <SupplierCard key={supplier?._id} title={supplier?.name} referrer={supplier?.referrer} budgets={supplier?.budgets} path={`/${path}/${pid}/${supplier?._id}`} id={supplier?._id} />
                }) : null}
              </div>
            </section>
          </>
        ) : (
          <Title className={"text-center"}>No existe ese proveedor</Title>
        )
      ) : (
        <BounceLoader size={100} />
      )}
    </Main>
  )
}

export default Project