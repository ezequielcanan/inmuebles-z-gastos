import { Link } from "react-router-dom"
import { formatNumber } from "../../utils/numbers.js"

const PaymentCard = ({ payment, nextPayment, budget }) => {
  return (
    <Link to={`/budgets/${payment?.budget}/payments/${payment?._id}`} className="bg-secondary shadow-[10px_10px_15px_0px_#f5401c] cursor-pointer border-primary flex flex-col w-full gap-y-4 py-6 px-6 text-black duration-300 hover:scale-105">
      <div>
        <h3 className="text-2xl font-bold">Certificado {payment?.paymentNumber} - {payment?.white?.bills?.length} factura/s</h3>
      </div>
      <div>
        <p className="text-xl font-bold">Indice CAC: {payment?.indexCac}</p>
        <p className="text-xl font-bold">Porcentaje: {payment?.percentageOfTotal?.toFixed(2)}</p>
      </div>
    </Link>
  )
}

export default PaymentCard