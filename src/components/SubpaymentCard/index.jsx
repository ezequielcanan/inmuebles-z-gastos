import { Link, useLocation } from "react-router-dom"

const SubpaymentCard = ({payment}) => {
  const location = useLocation()
  const checksTotal = payment?.checks?.reduce((acc,check) => acc + check.amount,0)

  return <Link to={`${location.pathname}/${payment?._id}`} className="bg-secondary shadow-[10px_10px_15px_0px_#f5401c] cursor-pointer border-primary flex flex-col w-full gap-y-4 py-6 px-6 text-black duration-300 hover:scale-105">
    <div>
      <h3 className="font-bold text-2xl">Adelanto</h3>
    </div>
    <div>
      <p className="text-xl">Cheques totales: {payment?.checks?.length}</p>
      <p className="text-xl">Total en cheques: {checksTotal}</p>
      <p className="text-xl">Retencion: {payment.retention ? "%" + payment.retention : 0}</p>
      <p className="text-xl">Total pagado: {(payment?.cashPaid?.total || 0) + checksTotal}</p>
    </div>
  </Link>
}

export default SubpaymentCard