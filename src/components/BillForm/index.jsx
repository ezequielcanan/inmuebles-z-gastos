import { FaFileArrowUp, FaFileCircleCheck } from "react-icons/fa6"
import Form from "../Form"
import SelectInput from "../FormInput/SelectInput"
import Input from "../FormInput/Input"
import Label from "../Label"
import Button from "../Button"

const BillForm = ({onSubmit, setFile, file, register, billOptions, hasConcept=true, hasBillOptions=true}) => {
  return <Form onSubmit={onSubmit} className={"bg-third text-black flex flex-col items-center justify-between self-center p-5"}>
    <Input type="file" className={"hidden"} containerClassName={"!border-b-0 text-center max-w-[200px] w-full"} id="file" onChange={(e) => setFile(e.target.files[0])}>
      <Label name={"file"} className={"flex flex-col cursor-pointer text-center items-center justify-center border-4 border-black text-black max-w-[200px] w-full max-h-[200px] h-[200px]"}>
        {!file ? <FaFileArrowUp /> : <>
          <FaFileCircleCheck size={180} className="p-4" />
          <p className="text-sm w-full overflow-hidden bg-white text-primary !text-wrap">{file.name}</p>
        </>}
      </Label>
    </Input>
    <SelectInput options={[{text: "A", value: "A"},{text: "B", value: "B"},{text: "C", value: "C"}]} optionClassName={"text-white"} register={{...register("type")}} containerClassName={"!w-full border-b-black"} className={"!w-1/5"}>
      <Label name={"type"}>Tipo</Label>
    </SelectInput>
    <Input register={{ ...register("cuit") }} containerClassName={"!w-full border-b-black"} className={"!w-full max-w-[200px]"}>
      <Label name={"cuit"}>CUIT:</Label>
    </Input>
    <Input register={{ ...register("iva", { required: true }) }} type="number" containerClassName={"!w-full border-b-black"} className={"!w-full max-w-[150px]"}>
      <Label name={"iva"}>IVA:</Label>
    </Input>
    <Input register={{ ...register("taxes", { required: true }) }} type="number" containerClassName={"!w-full border-b-black"} className={"!w-full max-w-[150px]"}>
      <Label name={"taxes"}>Otros impuestos:</Label>
    </Input>
    <Input register={{ ...register("code", { required: true }) }} containerClassName={"!w-full border-b-black"} className={"!w-full max-w-[350px]"}>
      <Label name={"code"}>N° de factura:</Label>
    </Input>
    <Input register={{ ...register("emissionDate", { required: true }) }} type="date" containerClassName={"!w-full border-b-black"} className={"!w-full"}>
      <Label name={"emissionDate"} text={"Fecha de emision:"} />
    </Input>
    <Input register={{ ...register("amount", { required: true }) }} type="number" containerClassName={"!w-full border-b-black"} className={"!w-full max-w-[350px]"}>
      <Label name={"amount"}>Importe gravado:</Label>
    </Input>
    <Input register={{ ...register("freeAmount", { required: true }) }} type="number" containerClassName={"!w-full border-b-black"} className={"!w-full max-w-[350px]"}>
      <Label name={"freeAmount"}>Importe no gravado:</Label>
    </Input>
    {hasConcept && (hasBillOptions ? (
      <SelectInput options={billOptions} optionClassName={"!text-white"} containerClassName={"!w-full border-b-black"} className={"!w-full"} register={{ ...register("concept") }}>
        <Label name={"concept"} text={"En concepto de:"} />
      </SelectInput>
    ) : (
      <Input containerClassName={"!w-full border-b-black"} className={"!w-full"} register={{ ...register("concept") }}>
        <Label name={"concept"} text={"En concepto de:"} />
      </Input>
    ))}
    <Button className={"text-center justify-center max-w-[200px] w-[200px]"} type="submit">
      Subir factura
    </Button>
  </Form>
}

export default BillForm