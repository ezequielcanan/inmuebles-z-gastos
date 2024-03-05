import moment from "moment"
import { Link } from "react-router-dom"

const NotificationCard = ({ message }) => {
  const card = <div className="flex flex-col sm:flex-row border-4 border-secondary bg-white/30 duration-500 hover:bg-white/70">
    <div className="flex flex-col gap-y-[10px] p-5 border-secondary sm:border-r-2">
      <p className="text-xl font-bold">{message?.title}</p>
      <p>De: {message?.from?.name}</p>
      <p>{moment(message?.dateTime).format("DD-MM-YYYY HH:mm:ss")}</p>
    </div>
    <div className="p-5">
      <p>{message?.text}</p>
    </div>
  </div>
  return (
    <Link to={message?.type == "certificate" ? `/budgets/${message?.data?.budget?._id}/payments/${message?.data?.payment?._id}/a/new` : `/projects/${message?.data?.bill?.project}/${message?.data?.bill?.receiver}/${message?.data?.bill?._id}/pay`}>{card}</Link>
  )
}

export default NotificationCard