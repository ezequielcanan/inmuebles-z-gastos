import { Link } from "react-router-dom"

const ProjectCard = ({thumbnail, title, id, path}) => {
  return (
    <div className="relative w-full sm:w-[400px]">
      <Link to={path || `/projects/${id}`} className={`flex flex-col relative shadow-xl shadow-[#000] z-10  h-[320px] bg-right bg-cover flex justify-center duration-500 justify-content-center hover:brightness-[40%] project-card`}>
        <div className="absolute z-20 top-0 w-full h-[80px] flex items-center justify-center text-3xl font-bold bg-black/50 text-fourth px-3">
          <h3 className="mx-auto flex items-center justify-center text-white">{title}</h3>
        </div>
        <img src={`${import.meta.env.VITE_REACT_API_URL}/static/${thumbnail}`} alt="" className="object-cover w-full h-full absolute z-0 bg-blend-multiply bg-black/80" />
      </Link>
    </div>
  )
}

export default ProjectCard