import { useNavigate, useParams } from "react-router-dom"
import Main from "../../containers/Main"
import Section from "../../containers/Section"
import BillForm from "../../components/BillForm"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import customAxios from "../../config/axios.config"
import { BounceLoader } from "react-spinners"
import Title from "../../components/Title"

const NewBill = () => {
  const {sid, pid} = useParams()
  const [file, setFile] = useState(false)
  const [supplier, setSupplier] = useState(false)
  const [project, setProject] = useState(false)
  const {register, handleSubmit} = useForm()
  const navigate = useNavigate()

  useEffect(() => {
    customAxios.get(`/supplier/${sid}`).then(res => {
      setSupplier(res?.data?.payload)
    }).catch(e => {
      setSupplier("error")
    })
  }, [])

  useEffect(() => {
    customAxios.get(`/projects/${pid}`).then(res => {
      setProject(res?.data?.payload)
    }).catch(e => {
      setProject("error")
    })
  }, [])


  const onSubmit = handleSubmit(async data => {
    data.cuit = data?.cuit || payment?.budget?.supplier?.cuit
    data.receiver = sid
    data.project = pid
    data.hasCertificate = false
    const result = (await customAxios.post(`/bill`, data)).data

    data.folder = `projects/${pid}/supplier/${sid}/bill/${result?.payload?._id}`
    const formData = new FormData()
    formData.append("data", JSON.stringify(data))
    formData.append("file", file)

    const fileResult = (await customAxios.post(`/bill/file/${pid}`, formData, { headers: { "Content-Type": "multipart/form-data" } })).data
    navigate(`/projects/${pid}/${sid}`)
  })

  return (
    <Main className={"flex flex-col gap-y-[40px] items-center pb-[120px]"} paddings>
      {(project && project != "error" && supplier && supplier != "error") ? (
        <>
          <Section>
            <Title>Nueva factura: {project?.title} - {supplier?.name}</Title>
          </Section>
          <Section style="form">
            <BillForm hasBillOptions={false} register={register} hasConcept={false} onSubmit={onSubmit} file={file} setFile={setFile}/>
          </Section>
        </>
      ) : (
        (!project || !supplier) ? <BounceLoader size={100}/> : <Title>ERROR</Title>
      )}
    </Main>
  )
}

export default NewBill