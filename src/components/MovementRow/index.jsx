import { FaTrashAlt } from "react-icons/fa"
import customAxios from "../../config/axios.config"
import { formatNumber } from "../../utils/numbers"

const MovementRow = ({movement, setReload}) => {

  const deleteMovement = async () => {
    await customAxios.delete(`/movement/${movement?._id}`)
    setReload(prev => !prev)
  }

  return (
    <tr className="border-b-4 border-secondary duration-300">
      <td className="p-3">{movement?.emissionDate}</td>
      <td className="p-3">{movement?.expirationDate}</td>
      <td className="p-3">{movement?.checkCode}</td>
      <td className="p-3">{movement?.detail}</td>
      <td className="p-3">{formatNumber(movement?.credit)}</td>
      <td className="p-3">{formatNumber(movement?.debit)}</td>
      <td className="p-3">{formatNumber(movement?.tax)}</td>
      <td className="p-3">{formatNumber(movement?.sixThousandths)}</td>
      <td className="p-3">{formatNumber(movement?.balance)}</td>
      {movement?.canBeDeleted != false && <td className="p-3 text-red-600"><FaTrashAlt className="cursor-pointer" onClick={() => deleteMovement()}/></td>}
    </tr>
  )
}

export default MovementRow