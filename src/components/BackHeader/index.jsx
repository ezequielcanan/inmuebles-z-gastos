import { Link } from "react-router-dom"
import { FaChevronLeft } from "react-icons/fa"
import Breadcrumb from "../Breadcrumb"

const BackHeader = ({ backpath, paths, condition }) => {
  return <div className="flex items-center gap-4">
    <Link to={backpath}><FaChevronLeft size={50} /></Link>
    {condition ? <Breadcrumb paths={paths} /> : null}
  </div>
}

export default BackHeader