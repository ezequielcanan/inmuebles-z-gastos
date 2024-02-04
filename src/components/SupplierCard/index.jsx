import { SiGoogledocs } from "react-icons/si"
import { Link } from "react-router-dom"

const SupplierCard = ({title, referrer, budgets, id}) => {
  return <Link to={`/suppliers/${id}`} className="bg-secondary shadow-[10px_10px_15px_0px_#f5401c] cursor-pointer border-primary flex flex-col justify-between gap-y-4 py-6 px-3 text-black duration-300 hover:scale-105">
    <div className="flex items-center justify-between">
      <h2 className="text-3xl font-bold w-10/12">{title.toUpperCase()}</h2>
      <Link><SiGoogledocs className="text-3xl w-2/12 duration-300 hover:text-white w-full h-full"/></Link>
    </div>
    <div className="flex flex-col text-2xl">
      <p>Referente: {referrer}</p>
      <p>Presupuestos vigentes: {budgets}</p>
    </div>
  </Link>
}

export default SupplierCard