import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Main from "../../containers/Main";
import customAxios from "../../config/axios.config";
import { BounceLoader } from "react-spinners";
import Title from "../../components/Title";
import Section from "../../containers/Section";
import Subtitle from "../../components/Subtitle";
import Button from "../../components/Button"
import { formatNumber } from "../../utils/numbers";
import { FaChevronLeft, FaEdit, FaPlusCircle, FaTrashAlt } from "react-icons/fa";
import { useForm } from "react-hook-form"
import moment from "moment";
import BalanceNoteCard from "../../components/BalanceNoteCard";
import Input from "../../components/FormInput/Input";
import Label from "../../components/Label";
import Form from "../../components/Form"

const Bill = () => {
  const { billId, bid, pid } = useParams();
  const { register, getValues, handleSubmit, setValue } = useForm()
  const [bill, setBill] = useState();
  const [edit, setEdit] = useState(false)
  const [values, setValues] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    customAxios
      .get(`/bill/${billId}`)
      .then((res) => {
        setBill(res?.data?.payload);
      })
      .catch((e) => {
        setBill("error");
      });
  }, [edit]);



  const deleteBill = async () => {
    await customAxios.delete(`/bill/${billId}/${pid}`)
    navigate(`/budgets/${bid}/payments/${pid}`)
  }

  const addBalanceNote = async () => {
    const result = await customAxios.post(`/bill/balance-note/${billId}`, { date: moment(), type: "credit", amount: 0, code: "" })
    setBill(result?.data?.payload)
  }

  const onSubmitUpdate = handleSubmit(async data => {
    const result = (await customAxios.put(`/bill/${billId}`, data)).data
    setEdit(false)
    setBill(result?.payload)
  })

  const getTotalByInputs = () => {
    const iva = values["iva"]
    const taxes = values["taxes"]
    const amount = values["amount"]
    return amount * (1 + (iva + taxes) / 100)
  }

  return (
    <Main className={"flex flex-col gap-y-[70px] py-[100px]"} paddings>
      {bill && bill != "error" ? (
        <>
          <Link to={`/budgets/${bid}/payments/${pid}`}>
            <FaChevronLeft className="text-4xl" />
          </Link>
          <Section>
            <Title>Factura Código: {bill?.code}</Title>
            <FaTrashAlt className="text-5xl text-primary" onClick={deleteBill} />
          </Section>
          <section className="flex flex-col gap-y-[30px] items-start">
            <div className="flex items-center gap-x-16">
              <Subtitle>Datos</Subtitle>
              <FaEdit className="text-4xl cursor-pointer" onClick={() => {
                setEdit(!edit)
                setValues({...bill})
              }} />
            </div>
            <Form onSubmit={onSubmitUpdate} className={"flex items-start"}>
              <div className="flex gap-x-[20px] items-center bg-secondary p-4">
                <Input className="!text-2xl" defaultValue={bill?.amount} type="number" disabled={!edit} register={{ ...register("amount") }} onChange={(e) => setValues({ ...values, amount: Number(e.target?.value) })}>
                  <Label name={"amount"} text={"Neto:"} className={"!text-2xl"} />
                </Input>
              </div>
              <div className="flex gap-x-[20px] items-center bg-secondary p-4">
                <Input className="!text-2xl" defaultValue={bill?.iva} type="number" disabled={!edit} register={{ ...register("iva") }} onChange={(e) => setValues({ ...values, iva: Number(e.target?.value) })}>
                  <Label name={"iva"} text={"IVA:"} className={"!text-2xl"} />
                </Input>
                <p className="text-2xl">{formatNumber(bill?.amount * bill?.iva / 100)}</p>
              </div>
              <div className="flex gap-x-[20px] items-center bg-secondary p-4">
                <Input className="!text-2xl" defaultValue={bill?.taxes} disabled={!edit} register={{ ...register("taxes") }} onChange={(e) => setValues({ ...values, taxes: Number(e.target?.value) })}>
                  <Label name={"taxes"} text={"Impuestos:"} className={"!text-2xl"} />
                </Input>
                <p className="text-2xl">{formatNumber(bill?.amount * bill?.taxes / 100)}</p>
              </div>
              <p className="text-2xl font-bold">Total: ${formatNumber(!edit ? (bill?.amount * (1 + (bill?.iva + bill?.taxes) / 100)) : getTotalByInputs())}</p>
              {edit && <Button type="submit" className={"border-4 rounded border-black"} style="submit">Confirmar</Button>}
            </Form>
          </section>
          <section className="flex flex-col gap-y-[30px] items-start">
            <Subtitle>Notas de crédito/débito</Subtitle>
            <div className="grid md:grid-cols-3 gap-8">
              {bill?.notes?.map((note) => {
                return <BalanceNoteCard note={note} bid={billId} setBill={setBill} />
              })}
              <div className="bg-third text-black border-4 border-black flex items-center justify-center duration-300 hover:bg-secondary p-4 text-4xl rounded" onClick={addBalanceNote}>
                <FaPlusCircle />
              </div>
            </div>
          </section>
        </>
      ) : !bill ? (
        <BounceLoader size={100} />
      ) : (
        <Title>ERROR</Title>
      )}
    </Main>
  );
};

export default Bill;
