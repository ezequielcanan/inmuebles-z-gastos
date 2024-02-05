import { useEffect, useState } from "react"
import { BounceLoader } from "react-spinners"
import ProjectCard from "../../components/ProjectCard"
import Title from "../../components/Title"
import Main from "../../containers/Main"
import customAxios from "../../config/axios.config"

const Projects = () => {
  const [projects, setProjects] = useState(false)

  useEffect(() => {
    customAxios.get("/projects?filter=false").then(res => {
      setProjects(res?.data?.payload || [])
    }).catch(e => {
      console.log(e)
      setProjects(false)
    })
  }, [])
  return (
    <Main className={"flex flex-col gap-y-[70px]"} paddings>
      <section>
        <Title className={"text-center xl:text-start"}>Proyectos</Title>
      </section>
      <section className="grid gap-8 justify-items-center xl:justify-items-start md:grid-cols-3">
        {projects.length ? (
          projects.map((project,i) => {
            console.log(project)
            return <ProjectCard thumbnail={project.thumbnail} title={project.title} key={i}/>
          })
        ) : (
          <BounceLoader/>
        )}
      </section>
    </Main>
  )
}

export default Projects