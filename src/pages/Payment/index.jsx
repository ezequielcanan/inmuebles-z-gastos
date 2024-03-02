import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { BounceLoader } from "react-spinners"
import { FaChevronLeft, FaDownload, FaFileArrowUp, FaFileArrowDown, FaFileCircleCheck, FaNoteSticky, FaTrash } from "react-icons/fa6"
import { FaTrashAlt } from "react-icons/fa"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, A11y } from 'swiper/modules'
import { useForm } from "react-hook-form"
import moment from "moment"
import Form from "../../components/Form"
import Note from "../../components/Note"
import Title from "../../components/Title"
import Main from "../../containers/Main"
import Section from "../../containers/Section"
import customAxios from "../../config/axios.config"
import Label from "../../components/Label"
import Subtitle from "../../components/Subtitle"
import Input from "../../components/FormInput/Input"
import Button from "../../components/Button"
import { formatNumber } from "../../utils/numbers"
import SubpaymentCard from "../../components/SubpaymentCard"
import SelectInput from "../../components/FormInput/SelectInput"
import BillCard from "../../components/BilllCard"


import "swiper/css"
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import BillForm from "../../components/BillForm"

const Payment = () => {
  const { pid, bid } = useParams()
  const { register, handleSubmit, reset } = useForm()
  const [payment, setPayment] = useState(false)
  const [lastPayment, setLastPayment] = useState(false)
  const [file, setFile] = useState(false)
  const [files, setFiles] = useState([])
  const [reloadFlag, setReloadFlag] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    customAxios.get(`/payment/${pid}`).then(res1 => {
      customAxios.get(`/payment/budget/${res1?.data?.payload?.budget?._id}`).then(res => {
        const lastPayment = res?.data?.payload.find((p) => p?.paymentNumber == res1?.data?.payload?.paymentNumber - 1)
        setLastPayment(lastPayment)
      })

      customAxios.get(`/payment/file/${res1?.data?.payload?.budget?.project?._id}/${bid}/${pid}`).then(resFiles => {
        setFiles(resFiles?.data?.payload)
      })
      setPayment(res1?.data?.payload || {})
    }).catch(e => {
      setPayment("error")
    })
  }, [reloadFlag])

  const getSectionTotal = (type, percentage) => {
    const lastAdjustment = (lastPayment?.indexCac / payment?.budget?.baseIndex)
    const adjustment = (payment?.indexCac / payment?.budget?.baseIndex)
    const mcd = lastPayment ? lastPayment[type]?.mcd - lastPayment[type]?.mcp : 0
    const mcp = payment[type]?.amount * (adjustment - 1)
    const total = mcd + mcp + payment[type]?.amount
    const taxes = total * (payment[type]?.bills?.length ? ((payment[type]?.bills[0]?.bill?.iva + payment[type]?.bills[0]?.bill?.taxes) || 0) / 100 : 0)
    
    const lastDiscountByApartments = (lastPayment?.discountByApartments * percentage / 100) || 0
    const apartmentsMcp = lastPayment ? lastDiscountByApartments * (lastAdjustment - 1)  : 0
    const apartmentsMcd = lastPayment ? lastDiscountByApartments * (adjustment - 1) - apartmentsMcp : 0
    const discountByApartments = ((payment?.discountByApartments * percentage / 100) || 0)


    const balance = total + taxes - apartmentsMcd - discountByApartments - discountByApartments * (adjustment - 1)
    return formatNumber((balance) || 0)
  }

  const addNote = async () => {
    const result = (await customAxios.post(`/payment/${payment?._id}/notes`, { date: moment(), note: "" })).data
    setReloadFlag(!reloadFlag)
  }

  const onSubmit = handleSubmit(async data => {
    data.cuit = data?.cuit || payment?.budget?.supplier?.cuit
    data.receiver = payment?.budget?.supplier?._id
    const result = (await customAxios.post(`/bill/${pid}`, data)).data

    data.folder = `projects/${payment?.budget?.project?._id}/budgets/${payment?.budget?._id}/payments/${payment?._id}/bill/${result?.payload?._id}`
    const formData = new FormData()
    formData.append("data", JSON.stringify(data))
    formData.append("file", file)

    const fileResult = (await customAxios.post(`/bill/file/${pid}`, formData, { headers: { "Content-Type": "multipart/form-data" } })).data
    reset()
    setReloadFlag(!reloadFlag)
    setFile(false)
  })
  
  const deletePayment = async () => {
    const result = (await customAxios.delete(`/payment/${pid}`)).data
    navigate(`/budgets/${bid}`)
  }

  const uploadFile = async e => {
    const budget = payment?.budget
    const file = e.target?.files[0]

    const data = {}
    data.folder = `projects/${budget?.project?._id}/budgets/${budget?._id}/payments/${payment?._id}`
    const formData = new FormData()
    formData.append("data", JSON.stringify(data))
    formData.append("file", file)

    const fileResult = (await customAxios.post("/payment/file", formData, { headers: { "Content-Type": "multipart/form-data" } })).data
    setReloadFlag(!reloadFlag)
  }

  const deleteFile = async (thumbnail) => {
    await customAxios.delete(`/payment/file/${pid}`, {data: {thumbnail}})
    setReloadFlag(!reloadFlag)
  }

  const billOptions = [{ text: "Certficado", value: "certificate" }, { text: "MCD", value: "mcd" }, { text: "MCP", value: "mcp" }]

  return (
    <Main className={"flex flex-col pb-[100px] gap-y-[70px]"} paddings>
      <Link to={`/budgets/${bid}`}>
        <FaChevronLeft className="text-4xl"/>
      </Link>
      {(payment && payment != "error") ? (
        <>
          <Section>
            <Title>
              Pago {payment?.paymentNumber} - {payment?.budget?.supplier?.name}
            </Title>
            <div className="flex items-center gap-x-8 text-5xl">
              <a href={`${import.meta.env.VITE_REACT_API_URL}/api/payment/excel/${payment?._id}`} download>
                <Button style="icon" className={"text-white w-16 h-16"}>
                  <FaDownload className="p-1" />
                </Button>
              </a>
              {payment?.budget?.lastPayment?._id == payment?._id && <FaTrashAlt className="text-primary cursor-pointer" onClick={deletePayment}/>}
            </div>
          </Section>
          <section className="flex">

          </section>
          <section className="grid sm:grid-cols-2 gap-16">
            <div className="flex flex-col gap-y-[50px]">
              <div>
                <Subtitle>Seccion A</Subtitle>
              </div>
              <div className="flex flex-col gap-y-[10px]">
                <p className="text-2xl font-bold">SALDO A PAGAR: ${getSectionTotal("white", payment?.budget?.percentage)}</p>
                <div className="flex w-full gap-8 justify-between items-center">
                  <Link to={`/budgets/${payment?.budget?._id}/payments/${payment?._id}/a/new`}>
                    <Button className={"bg-secondary !text-black after:bg-third border-4 border-black"}>
                      Agregar pago
                    </Button>
                  </Link>
                </div>
                <div className="grid lg:grid-cols-2 gap-8">
                  {payment?.white?.payments?.map((p, i) => {
                    return <SubpaymentCard payment={p} type={"a"} key={i} />
                  })}
                </div>
              </div>
              <BillForm onSubmit={onSubmit} file={file} setFile={setFile} register={register} billOptions={billOptions}/>
              <div className="flex flex-col gap-y-[30px] self-start w-full">
                <div className="self-start">
                  <Subtitle>Facturas</Subtitle>
                </div>
                <div className="grid xl:grid-cols-2 gap-8 w-full">
                  {payment?.white?.bills?.length ? payment?.white?.bills?.map((bill) => {
                    return <BillCard bill={bill} key={bill?._id} path={`/budgets/${bid}/payments/${pid}/${bill?.bill?._id}`}/>
                  }) : <p>No hay facturas registradas</p>}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-y-[50px]">
              <div>
                <Subtitle>Seccion B</Subtitle>
              </div>
              <div className="flex w-full gap-8 justify-between items-center">
                <div className="flex flex-col w-full gap-y-[10px]">
                  <p className="text-2xl font-bold">TOTAL A PAGAR: ${getSectionTotal("black", (100 - payment?.budget?.percentage))}</p>
                  <div className="flex w-full gap-8 justify-between items-center">
                    <Link to={`/budgets/${payment?.budget?._id}/payments/${payment?._id}/b/new`}>
                      <Button className={"bg-secondary !text-black after:bg-third border-4 border-black"}>
                        Agregar pago
                      </Button>
                    </Link>
                  </div>
                  <div className="grid lg:grid-cols-2 gap-8">
                    {payment?.black?.payments?.map((p, i) => {
                      return <SubpaymentCard payment={p} type={"b"} key={i} />
                    })}
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="flex flex-col items-start gap-y-[50px]">
            <Subtitle>Archivos</Subtitle>
            <Swiper slidesPerView={4} modules={[Navigation, Pagination, A11y]} autoHeight spaceBetween={20} navigation className="!w-full items-center" wrapperClass="flex items-start min-h-[200px]">
              {files.map((file, i) => {
                return file.includes(".") ? (<SwiperSlide key={file} className="!h-full">
                  <div className="relative h-full">
                    <a href={`${import.meta.env.VITE_REACT_API_URL}/static/projects/${payment?.budget?.project?._id}/budgets/${payment?.budget?._id}/payments/${payment?._id}/${file}`} download className="flex text-white h-full items-center gap-y-[30px] bg-secondary flex-col justify-center p-4">
                      <FaFileArrowDown className="text-4xl" />
                      <h3 className="font-ubuntu text-center text-3xl">{file}</h3>
                    </a>
                    <div className="absolute top-2 right-2 p-2 text-xl hover:scale-105 duration-300 text-primary cursor-pointer bg-white rounded-full">
                      <FaTrash onClick={() => deleteFile(`projects/${payment?.budget?.project?._id}/budgets/${payment?.budget?._id}/payments/${payment?._id}/${file}`)}/>
                    </div>
                  </div>
                </SwiperSlide>) : null
              })}
              <SwiperSlide className="!h-full">
                <Input type="file" containerClassName={"w-full border-b-0 h-full"} className={"hidden"} id="filePayment" onChange={uploadFile}>
                  <Label name={"filePayment"} className={"flex w-full h-full justify-center items-center border-4 border-dashed bg-secondary duration-500 hover:bg-secondary/60 border-white cursor-pointer text-center"}>
                    <FaFileArrowUp className="text-white" />
                  </Label>
                </Input>
              </SwiperSlide>
            </Swiper>
          </section>
          <section className="flex flex-col items-start gap-y-[30px]">
            <Subtitle className={"w-full sm:w-auto"}>Notas</Subtitle>
            <div className="flex flex-col gap-y-[10px] w-full">
              {payment?.notes?.length ? payment?.notes?.map((note, i) => {
                console.log(note.note)
                return <Note note={note} setReload={setReloadFlag} id={payment?._id} endpoint="payment" key={note._id} />
              }) : <p>No hay notas registradas</p>}
              <Button className={"bg-blue-500 after:bg-blue-700 self-start"} onClick={addNote}>
                Agregar nota <FaNoteSticky />
              </Button>
            </div>
          </section>
        </>
      ) : (
        !payment ? <BounceLoader size={100} /> : <Title>ERROR</Title>
      )}
    </Main>
  )
}

export default Payment