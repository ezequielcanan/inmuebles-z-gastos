import { FaEdit, FaTrashAlt } from "react-icons/fa"
import { Link } from "react-router-dom"
import customAxios from "../../config/axios.config"

const SupplierCard = ({ title, referrer, setReload, budgets, id, path }) => {
  const onClickTrash = async (e) => {
    const result = (await customAxios.delete(`/supplier/${id}`)).data
    setReload((prev) => !prev)
  }

  return <div className="relative">
    <Link to={path || `/suppliers/${id}`} className="bg-secondary shadow-[10px_10px_15px_0px_#f5401c] cursor-pointer border-primary flex flex-col justify-between gap-y-4 py-6 px-3 text-black duration-300 hover:shadow-[10px_10px_15px_0px_#a3201a]">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold w-10/12">{title.toUpperCase()}</h2>
      </div>
      <div className="flex flex-col text-2xl">
        <p>Referente: {referrer}</p>
        <p>Presupuestos vigentes: {budgets}</p>
      </div>
    </Link>
    <div className="flex gap-x-[10px] items-center absolute top-8 right-5">
      <Link to={`/suppliers/${id}/edit`}>
        <FaEdit size={20} className="duration-300 hover:scale-110" />
      </Link>
      {!budgets && (
        <Link to={`/suppliers`}>
          <FaTrashAlt size={20} onClick={onClickTrash} className="duration-300 hover:scale-110" />
        </Link>)}
    </div>
  </div>
}

export default SupplierCard