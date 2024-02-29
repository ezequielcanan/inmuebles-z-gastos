import moment from "moment"
import Input from "../FormInput/Input"

const MovementRow = ({movement}) => {

  const inputProps = {
    containerClassName: "!border-b-0 !w-full",
    className: "!bg-transparent !w-full !p-0 !text-xl overflow-x-auto",
    disabled: true
  }

  return (
    <tr className="border-b-4 border-secondary">
      <td className="p-3"><Input defaultValue={moment.utc(movement?.date).format("YYYY-MM-DD")} {...inputProps}/></td>
      <td className="p-3"><Input defaultValue={movement?.checkCode} containerClassName={"!border-b-0 !w-full"} {...inputProps}/></td>
      <td className="p-3"><Input defaultValue={movement?.detail} {...inputProps}/></td>
      <td className="p-3"><Input defaultValue={movement?.credit} {...inputProps}/></td>
      <td className="p-3"><Input defaultValue={movement?.debit} {...inputProps}/></td>
      <td className="p-3"><Input defaultValue={movement?.tax * movement?.credit} {...inputProps}/></td>
      <td className="p-3"><Input defaultValue={movement?.credit * 0.006} {...inputProps}/></td>
      <td className="p-3"><Input defaultValue={movement?.debit * 0.006} {...inputProps}/></td>
    </tr>
  )
}

export default MovementRow