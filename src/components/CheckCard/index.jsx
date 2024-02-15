import { useEffect, useState } from "react"
import customAxios from "../../config/axios.config"
import moment from "moment"
import { FaFileDownload, FaTrash } from "react-icons/fa"

const CheckCard = ({check, thumbnail, anchorThumbnail, payment, sid, setSubpayment}) => {
  const [documentSrc, setDocumentSrc] = useState(false)
  useEffect(() => {
    customAxios.patch(`/check/file`, {thumbnail}).then(res => {
      setDocumentSrc(res?.data?.payload[0] || "")
    })
  }, [])

  const deleteCheck = async () => {
    const result = (await customAxios.delete(`/check/file`, {data: {payment, check, sid}}))
    setSubpayment(result?.data?.payload)
  }

  return (
    <div className="bg-secondary shadow-[10px_10px_15px_0px_#f5401c] w-full border-primary flex flex-col justify-between gap-y-4 py-6 px-3 text-black duration-300">
      <div className="flex flex-col gap-y-[30px]">
        <div className="flex items-center justify-between gap-x-[10px]">
          <h3 className="text-3xl font-bold">Cheque: {check.code}</h3>
          <FaTrash onClick={deleteCheck} className="text-3xl"/>
          {documentSrc && 
          <a href={`${import.meta.env.VITE_REACT_API_URL}${anchorThumbnail}/${documentSrc}`} download>
            <FaFileDownload size={30}/>
          </a>}
        </div>
        <h4 className="text-3xl font-bold">Total: ${check?.amount}</h4>
      </div>
      <div>
        <p className="text-xl">Fecha de emision: {moment.utc(check.emissionDate).format("YYYY-MM-DD")}</p>
        <p className="text-xl">Fecha de vencimiento: {moment.utc(check.expirationDate).format("YYYY-MM-DD")}</p>
      </div>
    </div>
  )
}

export default CheckCard