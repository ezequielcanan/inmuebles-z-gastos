import { useParams, Link } from "react-router-dom"
import Main from "../../containers/Main"
import Title from "../../components/Title"
import { useEffect, useState } from "react"
import { BounceLoader } from "react-spinners"
import customAxios from "../../config/axios.config"
import { Fa0, FaChevronLeft } from "react-icons/fa6"
import Section from "../../containers/Section"
import BudgetCard from "../../components/BudgetCard"

const Supplier = () => {
  const { sid } = useParams()
  const [supplier, setSupplier] = useState()
  const [budgets, setBudgets] = useState()

  useEffect(() => {
    customAxios.get(`/supplier/${sid}`).then(res => {
      setSupplier(res?.data?.payload || "error")
    }).catch(e => {
      setSupplier("error")
    })
  }, [])

  useEffect(() => {
    customAxios.get(`/budget/supplier/${sid}`).then(res => {
      setBudgets(res?.data?.payload)
    })
  }, [])

  return (
    <Main className={"flex flex-col pt-[150px] gap-y-[40px] px-[10px] xl:pt-[100px] xl:pl-[370px] xl:pr-[100px]"}>
      <Link to="/suppliers"><FaChevronLeft size={50}/></Link>
      {supplier ? (
        supplier != "error" ? (
          <>
            <Section>
              <Title>{supplier.name}</Title>
            </Section>
            <section className="grid gap-8 justify-items-center xl:justify-items-start md:grid-cols-3">
              {budgets?.length ? budgets?.map((budget) => {
                return <BudgetCard budget={budget}/>
              }) : <h2>No hay presupuestos de este proveedor</h2>}
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

export default Supplier