import { useParams } from "react-router-dom";
import Main from "../../containers/Main";
import Section from "../../containers/Section";
import { BounceLoader } from "react-spinners";
import { useEffect, useState } from "react";
import Subtitle from "../../components/Subtitle";
import customAxios from "../../config/axios.config";
import moment from "moment";
import Title from "../../components/Title";
import CheckCard from "../../components/CheckCard";
import TransferCard from "../../components/TransferCard";

const Subpayment = () => {
  const { pid, sid, type } = useParams();
  const [payment, setPayment] = useState(false)
  const [subpayment, setSubpayment] = useState(false);

  useEffect(() => {
    customAxios
      .get(`/${type == "a" ? "white-payment" : "black-payment"}/${sid}`)
      .then((res) => {
        setSubpayment(res?.data?.payload);
      })
      .catch((e) => {
        setSubpayment("error");
      });
  }, []);

  useEffect(() => {
    customAxios.get(`/payment/${pid}`).then(res => {
      setPayment(res?.data?.payload)
    }).catch((e) => {
      setPayment("error");
    });
  }, [])
  console.log(subpayment)
  return (
    <Main className={"flex flex-col gap-y-[70px]"} paddings>
      {(subpayment && subpayment != "error" && payment && payment != "error") ? (
        <>
          <Section>
            <Title>
              Adelanto {moment(subpayment?.date).format("YYYY-MM-DD")}
            </Title>
          </Section>
          {type == "a" ? (
            <>
              <section className="flex flex-col items-start gap-y-[30px]">
                <Subtitle>Cheques</Subtitle>
                <div className="grid gap-8 lg:grid-cols-3">
                  {subpayment?.checks?.map((check, i) => {
                    return <CheckCard check={check} thumbnail={`/public/projects/${payment?.budget?.project?._id}/budgets/${payment?.budget?._id}/payments/${payment?._id}/checks/${check?._id}`} anchorThumbnail={`/static/projects/${payment?.budget?.project?._id}/budgets/${payment?.budget?._id}/payments/${payment?._id}/checks/${check?._id}`} key={check._id} />
                  })}
                </div>
              </section>
              <section className="flex flex-col items-start gap-y-[30px]">
                <Subtitle>Transferencias</Subtitle>
                <div className="grid gap-8 lg:grid-cols-3">
                  {subpayment?.transfers?.map((transfer, i) => {
                    return <TransferCard transfer={transfer} thumbnail={`/public/projects/${payment?.budget?.project?._id}/budgets/${payment?.budget?._id}/payments/${payment?._id}/transfers/${transfer?._id}`} anchorThumbnail={`/static/projects/${payment?.budget?.project?._id}/budgets/${payment?.budget?._id}/payments/${payment?._id}/transfers/${transfer?._id}`} key={transfer._id} />
                  })}
                </div>
              </section>
            </>
          ) : (
            <section className="flex flex-col items-start gap-y-[30px]">
              <Subtitle>
                Pago en B
              </Subtitle>
              <div>
                <p className="text-2xl">Pagado: {subpayment.currency == "dollar" ? "USD " : "$"}{subpayment?.cashPaid}</p>
                <p className="text-2xl">Fecha: {moment.utc(subpayment?.date).format("DD-MM-YYYY")}</p>
                <p className="text-2xl">Valor del dolar: {subpayment.dollarPrice}</p>
              </div>
            </section>
          )}
        </>
      ) : (!subpayment || !payment) ? (
        <BounceLoader size={100} />
      ) : (
        <Title>ERROR</Title>
      )}
    </Main>
  );
};

export default Subpayment;
