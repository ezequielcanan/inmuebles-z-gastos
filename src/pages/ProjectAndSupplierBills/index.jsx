import { useParams, Link } from "react-router-dom"
import Main from "../../containers/Main"
import Title from "../../components/Title"
import { useEffect, useState } from "react"
import { BounceLoader } from "react-spinners"
import customAxios from "../../config/axios.config"
import { FaChevronLeft } from "react-icons/fa6"
import Subtitle from "../../components/Subtitle"
import Section from "../../containers/Section"
import BudgetCard from "../../components/BudgetCard"
import Button from "../../components/Button"
import BillCard from "../../components/BilllCard"
import { FaFileDownload } from "react-icons/fa"
import BackHeader from "../../components/BackHeader"


const ProjectAndSupplierBills = () => {
  const { pid, sid } = useParams()
  const [project, setProject] = useState()
  const [bills, setBills] = useState([])
  const [supplier, setSupplier] = useState(false)
  

  useEffect(() => {
    customAxios.get(`/supplier/${sid}`).then(res => {
      setSupplier(res?.data?.payload || "error")
    }).catch(e => {
      setSupplier("error")
    })
  }, [])

  useEffect(() => {
    customAxios.get(`/projects/${pid}`).then(res => {
      setProject(res?.data?.payload || "error")
    }).catch(e => {
      setProject("error")
    })
  }, [])

  useEffect(() => {
    customAxios.get(`/bill/${pid}/${sid}`).then(res => {
      setBills(res?.data?.payload)
    })
  }, [])

  return (
    <Main className={"flex flex-col pt-[150px] pb-[120px] gap-y-[70px] px-[10px] xl:pt-[100px] xl:pl-[370px] xl:pr-[100px]"}>
      <BackHeader backpath={`/bills/${pid}`}condition={(project && supplier)}  paths={[{name: "Facturas", path: "/bills"}, {name: project?.title, path: `/bills/${project?._id}`}, {name: supplier?.name, path: ``}]}/>
      {project ? (
        project != "error" ? (
          <>
            <Section>
              <Title>Facturas {project.title} - {supplier?.name}</Title>
              <div className="flex gap-x-[25px] items-center">
                <Link to={`/projects/${pid}/${sid}/new-bill`}>
                  <Button>
                    Nueva factura
                  </Button>
                </Link>
              </div>
            </Section>
            <section className="grid gap-8 justify-items-center xl:justify-items-start md:grid-cols-3">
              {bills.map((bill) => {
                return <BillCard path={`/projects/${pid}/${sid}/${bill?._id}`} bill={{ bill }} concept={false} key={bill?._id} />
              })}
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

export default ProjectAndSupplierBills