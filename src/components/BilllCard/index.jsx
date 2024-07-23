import { Link } from "react-router-dom"
import { formatNumber } from "../../utils/numbers"
import moment from "moment"

const BillCard = ({bill, path, concept = true}) => {
  return <Link to={path} className="bg-secondary shadow-[10px_10px_15px_0px_#f5401c] border-primary flex flex-col justify-between w-full gap-y-4 py-6 px-6 text-black duration-300">
    <div>
      <h3 className="text-2xl font-bold">Factura: {bill?.bill?.code}</h3>
    </div>
    <div>
      {concept && <p className="text-xl">Concepto: {bill?.concept == "certificate" ? "CERTIFICADO" : (bill.concept == "mcd" ? "MCD" : "MCP")}</p>}
      <p className="text-xl">Tipo: {bill?.bill?.type}</p>
      <p className="text-xl">Emisión: {moment.utc(bill?.bill?.emissionDate).format("DD-MM-YYYY")}</p>
      <p className="text-xl">Gravado: ${formatNumber(bill?.bill?.amount)}</p>
      <p className="text-xl">No gravado: ${formatNumber(bill?.bill?.freeAmount)}</p>
      <p className="text-xl">IVA: %{bill?.bill?.iva}</p>
      <p className="text-xl">Impuestos: %{bill?.bill?.taxes}</p>
      <p className="text-xl">Total: ${formatNumber(bill?.bill?.amount * (1 + (bill?.bill?.iva + bill?.bill?.taxes) / 100) + bill?.bill?.freeAmount)}</p>
    </div>
  </Link>
}

export default BillCard