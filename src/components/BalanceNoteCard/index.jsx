import moment from "moment"
import SelectInput from "../../components/FormInput/SelectInput"
import Input from "../FormInput/Input"
import Label from "../Label"
import customAxios from "../../config/axios.config"
import { FaTrashAlt } from "react-icons/fa"

const BalanceNoteCard = ({note, bid, setBill}) => {
  const noteType = note.type == "debit" ? "débito" : "crédito"

  const onChangeProperty = async (property, newValue) => {
    const updateObj = {}
    updateObj[property] = newValue
    const result = await customAxios.put(`/bill/balance-note/${bid}/${note?._id}`, updateObj)
    setBill(result?.data?.payload)
  }

  const onDelete = async () => {
    const result = await customAxios.delete(`/bill/balance-note/${bid}/${note?._id}`)
    setBill(result?.data?.payload)
  }

  return (
    <div className={`${note.type == "credit" ? "bg-success text-black" : "bg-fourth text-white"} w-full p-2 sm:p-4 flex flex-col items-center gap-y-[20px]`}>
      <div className="flex w-full items-center">
        <h3 className={`text-2xl ml-auto`}>Nota de {noteType}</h3>
        <div className="ml-auto bg-white p-2 rounded-full cursor-pointer" onClick={onDelete}>
          <FaTrashAlt className="text-primary text-xl"/>
        </div>
      </div>
      <div className="flex flex-col w-full">
        <SelectInput containerClassName={"gap-x-8 !w-full"} optionClassName={"!text-lg text-white"} options={[{text: "Crédito", value: "credit"}, {text: "Débito", value: "debit"}]} onChange={(e) => onChangeProperty("type", e?.target?.value)} defaultValue={note?.type} className={"sm:text-lg md:text-lg !w-full"}>
          <Label text={"Tipo"} className={"!text-lg"}/>
        </SelectInput>
        <Input type="text" containerClassName={"gap-x-8 !w-full"} className={"!text-lg !w-full"} onChange={(e) => onChangeProperty("code", e?.target?.value)} defaultValue={note?.code}>
          <Label text={"Código"} className={"!text-lg"}/>
        </Input>
        <Input type="number" containerClassName={"gap-x-8 !w-full"} className={"!text-lg !w-full"} onChange={(e) => onChangeProperty("amount", e?.target?.value)} defaultValue={note?.amount}>
          <Label text={"Total"} className={"!text-lg"}/>
        </Input>
        <Input type="date" containerClassName={"gap-x-4 !w-full"} className={"!text-lg !w-full"} onChange={(e) => onChangeProperty("date", e?.target?.value)} value={moment.utc(note?.date).format("YYYY-MM-DD")}>
          <Label text={"Fecha"} className={"!text-lg"}/>
        </Input>
      </div>
    </div>
  )
}

export default BalanceNoteCard