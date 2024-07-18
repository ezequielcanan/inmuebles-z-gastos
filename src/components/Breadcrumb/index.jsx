import { Link } from "react-router-dom"

const Breadcrumb = ({paths}) => {
  return (
    <div className="flex gap-1 items-center ">
      {paths.map((path, i) => {
        return <span className="text-3xl" key={path.name + i}>
           <Link to={path.path} className="hover:text-blue-600">
            {path.name}
          </Link>
          {i < paths.length - 1 && <span className="mx-2"> &gt; </span>}
        </span>
      })}
    </div>
  )
}

export default Breadcrumb