import { Link } from "react-router-dom"
import { formatNumber } from "../../utils/numbers.js"

const PaymentCard = ({ payment, nextPayment, budget }) => {
  return (
    <Link to={`/budgets/${payment?.budget}/payments/${payment?._id}`} className="bg-secondary shadow-[10px_10px_15px_0px_#f5401c] cursor-pointer border-primary flex flex-col w-full gap-y-4 py-6 px-6 text-black duration-300 hover:scale-105">
      <div>
        <h3 className="text-2xl font-bold">Pago {payment?.paymentNumber} - {payment?.white?.bill ? "Facturado" : "No facturado"}</h3>
      </div>
      <div>
        <p className="text-xl font-bold">Indice CAC: {payment?.indexCac}</p>
        <p className="text-xl font-bold">Total: ${formatNumber(payment?.white?.amount + payment?.black?.amount)}</p>
        <p className="text-xl">A: ${formatNumber(payment?.white?.amount)}</p>
        <p className="text-xl">B: ${formatNumber(payment?.black?.amount)}</p>
        <p className="text-xl font-bold">Mayor costo provisorio:</p>
        <p className="text-xl">A: ${formatNumber(payment?.white?.mcp)}</p>
        <p className="text-xl">B: ${formatNumber(payment?.black?.mcp)}</p>
        {nextPayment &&
          <>
            <p className="text-xl font-bold">Mayor costo definitivo:</p>
            <p className="text-xl">A: ${formatNumber(payment?.white?.mcd)}</p>
            <p className="text-xl">B: ${formatNumber(payment?.black?.mcd)}</p>
          </>}
      </div>
    </Link>
  )
}

export default PaymentCard