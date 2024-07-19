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
import PaymentCard from "../../components/PaymentCard"
import BackHeader from "../../components/BackHeader"

const ProjectAndSupplierCertificates = () => {
  const { pid, sid } = useParams()
  const [project, setProject] = useState()
  const [payments, setPayments] = useState(false)
  const [supplier, setSupplier] = useState(false)

  useEffect(() => {
    customAxios.get(`/projects/${pid}`).then(res => {
      setProject(res?.data?.payload || "error")
    }).catch(e => {
      setProject("error")
    })
  }, [])

  useEffect(() => {
    customAxios.get(`/supplier/${sid}`).then(res => {
      setSupplier(res?.data?.payload || "error")
    }).catch(e => {
      setSupplier("error")
    })
  }, [])

  useEffect(() => {
    customAxios.get(`/payment/project/${pid}/${sid}`).then(async res => {
      setPayments(res?.data?.payload)
    }).catch(e => {
      setPayments("error")
    })
  }, [])

  console.log(payments)

  return (
    <Main className={"flex flex-col pt-[150px] pb-[120px] gap-y-[70px] px-[10px] xl:pt-[100px] xl:pl-[370px] xl:pr-[100px]"}>
      <BackHeader backpath={`/payments/${pid}`}condition={(project && supplier)}  paths={[{name: "Certificados", path: "/payments"}, {name: project?.title, path: `/payments/${project?._id}`}, {name: supplier?.name, path: ``}]}/>
      {(project && payments && supplier) ? (
        project != "error" ? (
          <>
            <Section>
              <Title>Certificados {project.title} - {supplier?.name}</Title>
            </Section>
            <section className="grid gap-8 justify-items-center xl:justify-items-start md:grid-cols-3">
              {payments?.map((payment) => {
                return <PaymentCard payment={payment} key={payment?._id}/>
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

export default ProjectAndSupplierCertificates