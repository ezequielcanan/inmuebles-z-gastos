import Button from "../Button"
import Input from "../FormInput/Input"
import { RiSubtractFill } from "react-icons/ri"
import Label from "../Label"
import SelectInput from "../FormInput/SelectInput"
import { FaFileArrowUp, FaTrash } from "react-icons/fa6"
import customAxios from "../../config/axios.config"

const PaymentMethodForm = ({paymentMethod, setPaymentMethod, accounts, payment, sid, placeholder="cheque", endpoint="check", expiration = true}) => {
  const arrayIndex = (id, array = paymentMethod) => {
    return array.findIndex(a => a.id == id)
  }

  const onChangePropertiesState = (property, newValue, id, array = paymentMethod, setFunction = setPaymentMethod) => {
    const updateIndex = arrayIndex(id, array)
    const updateObject = {}
    updateObject[property] = newValue
    array[updateIndex] = { ...array[updateIndex], ...updateObject }
    setFunction([...array])
  }

  const deleteArrayObj = async (id, array = paymentMethod, setFunction = setPaymentMethod) => {
    const deleteIndex = arrayIndex(id, array)
    const obj = array[deleteIndex]
    if (obj.old) {
      const dataObj = {payment, check: obj, sid}
      dataObj[endpoint] = obj
      await customAxios.delete(`/${endpoint}/file`, {data: dataObj})
    }
    array.splice(deleteIndex, 1)
    setFunction([...array])
  }

  return (
    <div className="flex flex-col gap-y-[70px]">
      {paymentMethod.map((payment, i) => {
        return <div className="flex flex-col gap-y-[20px] items-start h-auto" key={payment.id}>
          <div className="flex items-center gap-8 justify-between w-full">
            <Button style="icon" type="button" className={"!bg-red-500 h-[50px]"} onClick={() => deleteArrayObj(payment.id)}>
              <FaTrash size={100} />
            </Button>
            <Input className={"!w-full max-w-[250px]"} placeholder={`N° de ${placeholder}`} value={payment?.code} onChange={e => onChangePropertiesState("code", e?.currentTarget?.value, payment?.id)} />
            <Input type="number" className={"!w-full max-w-[250px]"} value={payment?.amount} placeholder={"Monto"} onChange={e => onChangePropertiesState("amount", e?.currentTarget?.value, payment?.id)} />
            <SelectInput options={accounts} className={"!w-full"} value={payment?.account} onChange={(e) => onChangePropertiesState("account", e?.currentTarget?.value, payment?.id)} />
          </div>
          <div className="flex items-center justify-end w-full gap-x-4">
            <Input type="date" containerClassName={"!w-full grid"} value={payment?.emissionDate} onChange={e => onChangePropertiesState("emissionDate", e?.currentTarget?.value, payment?.id)}>
              <Label name={"date"} text={"Emision:"} />
            </Input>
            {expiration && <Input type="date" containerClassName={"!w-full grid"} value={payment?.expirationDate} onChange={e => onChangePropertiesState("expirationDate", e?.currentTarget?.value, payment?.id)}>
              <Label name={"date"} text={"Vencimiento:"} />
            </Input>}
            <Input type="file" className={"hidden"} containerClassName={"self-end"} id={"file" + placeholder + payment?.id} onChange={(e) => onChangePropertiesState("file", e?.target?.files[0], payment?.id)}>
              <p className="font-ubuntu md:text-4xl">Documento</p>
              <Label name={"file" + placeholder + payment?.id} className={"py-4 px-4 flex w-full justify-end cursor-pointer text-center"}>
                {!payment?.file ? <FaFileArrowUp /> : <p className="py-3 px-3 max-w-[200px] overflow-hidden bg-primary">{payment?.file?.name && "Archivo"}</p>}
              </Label>
            </Input>
          </div>
        </div>
      })}
    </div>
  )
}

export default PaymentMethodForm