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
    message?.type == "certificate" ? <Link to={`/budgets/${message?.data?.budget?._id}/payments/${message?.data?.payment?._id}/a/new`}>{card}</Link> : {card}
  )
}

export default NotificationCard