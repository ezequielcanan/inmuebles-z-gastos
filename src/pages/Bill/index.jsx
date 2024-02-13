import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Main from "../../containers/Main";
import customAxios from "../../config/axios.config";
import { BounceLoader } from "react-spinners";
import Title from "../../components/Title";
import Section from "../../containers/Section";
import Subtitle from "../../components/Subtitle";
import { formatNumber } from "../../utils/numbers";
import { FaPlusCircle } from "react-icons/fa";
import moment from "moment";
import BalanceNoteCard from "../../components/BalanceNoteCard";

const Bill = () => {
  const { bid } = useParams();
  const [bill, setBill] = useState();

  useEffect(() => {
    customAxios
      .get(`/bill/${bid}`)
      .then((res) => {
        setBill(res?.data?.payload);
      })
      .catch((e) => {
        setBill("error");
      });
  }, []);

  const addBalanceNote = async () => {
    const result = await customAxios.post(`/bill/balance-note/${bid}`, {date: moment(), type: "credit", amount: 0, code: ""})
    setBill(result?.data?.payload)
  }

  return (
    <Main className={"flex flex-col gap-y-[70px] py-[100px]"}paddings>
      {bill && bill != "error" ? (
        <>
          <Section>
            <Title>Factura Código: {bill?.code}</Title>
          </Section>
          <section className="flex flex-col gap-y-[30px] items-start">
            <Subtitle>Datos</Subtitle>
            <p className="text-2xl">Neto: ${formatNumber(bill?.amount)}</p>
            <p className="text-2xl">IVA: ${formatNumber(bill?.amount * bill?.iva / 100)}</p>
            <p className="text-2xl">Otros impuestos: ${formatNumber(bill?.amount * bill?.taxes / 100)}</p>
            <p className="text-2xl font-bold">Total: ${formatNumber(bill?.amount * (1 + (bill?.iva + bill?.taxes) / 100))}</p>
          </section>
          <section className="flex flex-col gap-y-[30px] items-start">
            <Subtitle>Notas de crédito/débito</Subtitle>
            <div className="grid md:grid-cols-3 gap-8">
              {bill?.notes?.map((note) => {
                return <BalanceNoteCard note={note} bid={bid} setBill={setBill}/>
              })}
              <div className="bg-third text-black border-4 border-black flex items-center justify-center duration-300 hover:bg-secondary p-4 text-4xl rounded" onClick={addBalanceNote}>
                <FaPlusCircle/>
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
