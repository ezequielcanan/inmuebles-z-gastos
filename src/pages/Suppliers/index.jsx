import Main from "../../containers/Main"
import SupplierCard from "../../components/SupplierCard"
import Button from "../../components/Button"
import Title from "../../components/Title"
import customAxios from "../../config/axios.config"
import { BounceLoader } from "react-spinners"
import { FaPlus } from "react-icons/fa"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState(false)

  useEffect(() => {
    customAxios.get("/supplier").then(res => {
      setSuppliers(res?.data?.payload || [])
    })
  }, [])

  return (
    <Main className={"flex flex-col gap-y-[70px] pt-[150px] px-[10px] xl:pt-[100px] xl:pl-[370px] xl:pr-[100px]"}>
      <section className="flex flex-col gap-y-[30px] md:flex-row justify-between items-center">
        <Title>Proveedores</Title>
        <Link to={"/suppliers/new"}>
          <Button>Agregar proveedor <FaPlus/></Button>
        </Link>
      </section>
      <section className="grid items-center justify-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 ">
        {suppliers ? (
          <>
            {suppliers.length ? suppliers.map((supplier,i) => {
              return <SupplierCard key={i} id={supplier._id} title={supplier.name} referrer={supplier.referrer} budgets={supplier.budgets || 0}/>
            }) : (
              <h2>No hay proveedores registrados</h2>
            )}
          </>
        ) : <BounceLoader/>}
      </section>
    </Main>
  )
}

export default Suppliers