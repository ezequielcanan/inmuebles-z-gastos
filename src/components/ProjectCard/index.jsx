const ProjectCard = ({thumbnail, title, budgets}) => {
  return (
    <div className="flex justify-between h-[250px] w-[280px] bg-secondary relative z-0 duration-300 hover:brightness-50">
      <img src={`${import.meta.env.VITE_REACT_API_URL}/static/${thumbnail}`} alt="" className="w-full h-full object-cover"/>
      <div className="absolute w-full flex py-4 justify-center top-0 left-0 h-full bg-black/30 z-10">
        <h2 className="font-bold text-white text-2xl">{title}</h2>
      </div>
    </div>
  )
}

export default ProjectCard