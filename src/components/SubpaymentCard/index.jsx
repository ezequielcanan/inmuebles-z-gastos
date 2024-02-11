import { Link, useLocation } from "react-router-dom"

const SubpaymentCard = ({ payment, type }) => {
  const location = useLocation()
  const checksTotal = payment?.checks?.reduce((acc, check) => acc + check.amount, 0) || 0
  const transfersTotal = payment?.transfers?.reduce((acc, transfer) => acc + transfer.amount, 0) || 0

  return <Link to={`${location.pathname}/${type}/${payment?._id}`} className="bg-secondary shadow-[10px_10px_15px_0px_#f5401c] cursor-pointer border-primary flex flex-col w-full gap-y-4 py-6 px-6 text-black duration-300 hover:scale-105">
    <div>
      <h3 className="font-bold text-2xl">Adelanto</h3>
    </div>
    <div>
      {type == "a" ? (
        <>
          <p className="text-xl">Cheques totales: {payment?.checks?.length}</p>
          <p className="text-xl">Total en cheques: {checksTotal}</p>
          <p className="text-xl">Retencion: {payment.retention ? "$" + payment.retention?.amount : 0}</p>
        </>
      ) : null}
      <p className="text-xl">Total pagado: {type == "a" ? checksTotal + transfersTotal : `${payment?.currency == "dollar" ? "USD" : "$"}${payment?.cashPaid}`}</p>
    </div>
  </Link>
}

export default SubpaymentCard