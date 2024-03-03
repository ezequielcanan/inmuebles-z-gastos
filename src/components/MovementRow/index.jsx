import moment from "moment"
import Input from "../FormInput/Input"

const MovementRow = ({movement, lastMovement}) => {

  const inputProps = {
    containerClassName: "!border-b-0 !w-full",
    className: "!bg-transparent !w-full !p-0 !text-xl overflow-x-auto",
    disabled: true
  }

  return (
    <tr className="border-b-4 border-secondary duration-300 hover:bg-white/40">
      <td className="p-3">{moment.utc(movement?.emissionDate).format("DD-MM-YYYY")}</td>
      <td className="p-3">{moment.utc(movement?.expirationDate).format("DD-MM-YYYY")}</td>
      <td className="p-3">{movement?.checkCode}</td>
      <td className="p-3">{movement?.detail}</td>
      <td className="p-3">{movement?.credit}</td>
      <td className="p-3">{movement?.debit}</td>
      <td className="p-3">{movement?.tax * movement?.credit}</td>
      <td className="p-3">{movement?.credit * 0.006}</td>
      <td className></td>
    </tr>
  )
}

export default MovementRow