import { useParams, Link } from "react-router-dom"
import Main from "../../containers/Main"
import Title from "../../components/Title"
import { useEffect, useState } from "react"
import { BounceLoader } from "react-spinners"
import customAxios from "../../config/axios.config"
import { Fa0, FaChevronLeft } from "react-icons/fa6"
import Section from "../../containers/Section"
import BudgetCard from "../../components/BudgetCard"
import SupplierCard from "../../components/SupplierCard"

const BillsProject = () => {
  const { pid } = useParams()
  const [project, setProject] = useState()
  const [suppliers, setSuppliers] = useState()

  useEffect(() => {
    customAxios.get(`/projects/${pid}`).then(res => {
      setProject(res?.data?.payload || "error")
    }).catch(e => {
      setProject("error")
    })
  }, [])

  useEffect(() => {
    customAxios.get(`/supplier?pid=${pid}`).then(res => {
      setSuppliers(res?.data?.payload)
    })
  }, [])

  return (
    <Main className={"flex flex-col pt-[150px] gap-y-[40px] px-[10px] xl:pt-[100px] xl:pl-[370px] xl:pr-[100px]"}>
      <Link to={`/bills`}><FaChevronLeft size={50}/></Link>
      {project ? (
        project != "error" ? (
          <>
            <Section>
              <Title>Facturas {project.title}</Title>
            </Section>
            <section className="grid gap-8 justify-items-center xl:justify-items-start md:grid-cols-3">
              {suppliers?.length ? suppliers?.map((supplier) => {
                return <SupplierCard key={supplier?._id} title={supplier?.name} referrer={supplier?.referrer} budgets={supplier?.budgets} path={`/bills/${pid}/${supplier?._id}`} id={supplier?._id}/>
              }) : <h2>No hay presupuestos de este proyecto</h2>}
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

export default BillsProject