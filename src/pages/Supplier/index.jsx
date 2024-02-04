import { useParams, Link } from "react-router-dom"
import Main from "../../containers/Main"
import Title from "../../components/Title"
import { useEffect, useState } from "react"
import { BounceLoader } from "react-spinners"
import customAxios from "../../config/axios.config"
import { Fa0, FaChevronLeft } from "react-icons/fa6"

const Supplier = () => {
  const { sid } = useParams()
  const [supplier, setSupplier] = useState()

  useEffect(() => {
    customAxios.get(`/supplier/${sid}`).then(res => {
      setSupplier(res?.data?.payload || "error")
    }).catch(e => {
      setSupplier("error")
    })
  }, [])
  
  console.log(supplier)

  return (
    <Main className={"flex flex-col pt-[150px] px-[10px] xl:pt-[100px] xl:pl-[370px] xl:pr-[100px]"}>
      {supplier ? (
        supplier != "error" ? (
          <section className="flex items-center justify-between w-full">
            <Link to="/suppliers"><FaChevronLeft size={50}/></Link>
            <Title>{supplier.name}</Title>
            <Fa0/>
          </section>
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