import { useEffect, useState } from "react"
import customAxios from "../../config/axios.config"
import moment from "moment"
import { FaFileDownload } from "react-icons/fa"

const TransferCard = ({transfer, thumbnail, anchorThumbnail, payment}) => {
  const [documentSrc, setDocumentSrc] = useState(false)
  useEffect(() => {
    customAxios.patch(`/transfer/file`, {thumbnail}).then(res => {
      setDocumentSrc(res?.data?.payload[0] || "")
    })
  }, [])
  return (
    <div className="bg-secondary shadow-[10px_10px_15px_0px_#f5401c] w-full border-primary flex flex-col justify-between gap-y-4 py-6 px-3 text-black duration-300">
      <div className="flex flex-col gap-y-[30px]">
        <div className="flex justify-between gap-x-[10px]">
          <h3 className="text-3xl font-bold">Transferencia: {transfer.code}</h3>
          {documentSrc && <a href={`${import.meta.env.VITE_REACT_API_URL}${anchorThumbnail}/${documentSrc}`} download>
            <FaFileDownload size={30}/>
          </a>}
        </div>
        <h4 className="text-3xl font-bold">Total: ${transfer?.amount}</h4>
      </div>
      <div>
        <p className="text-xl">Fecha de emision: {moment.utc(transfer.emissionDate).format("YYYY-MM-DD")}</p>
      </div>
      
    </div>
  )
}

export default TransferCard