import Main from "../../containers/Main"
import SupplierCard from "../../components/SupplierCard"
import Button from "../../components/Button"
import Title from "../../components/Title"
import customAxios from "../../config/axios.config"
import { BounceLoader } from "react-spinners"
import { FaPlus } from "react-icons/fa"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import Section from "../../containers/Section"

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState(false)
  const [reload, setReload] = useState(false)

  useEffect(() => {
    customAxios.get("/supplier").then(res => {
      setSuppliers(res?.data?.payload || [])
    })
  }, [reload])

  return (
    <Main className={"flex flex-col gap-y-[70px]"} paddings>
      <Section>
        <Title>Proveedores</Title>
        <Link to={"/suppliers/new"}>
          <Button>Agregar proveedor <FaPlus /></Button>
        </Link>
      </Section>
      <section className="grid justify-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 ">
        {suppliers ? (
          <>
            {suppliers.length ? suppliers.map((supplier, i) => {
              return <SupplierCard key={i} id={supplier._id} title={supplier.name} setReload={setReload} referrer={supplier.referrer} budgets={supplier.budgets || 0} />
            }) : (
              <h2>No hay proveedores registrados</h2>
            )}
          </>
        ) : <BounceLoader />}
      </section>
    </Main>
  )
}

export default Suppliers