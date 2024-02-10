import moment from "moment"
import Input from "../FormInput/Input"
import Label from "../Label"
import { RiSubtractFill } from "react-icons/ri"
import Button from "../Button"
import Textarea from "../FormInput/Textarea"
import customAxios from "../../config/axios.config"

const Note = ({ note, id, endpoint="budget", setReload }) => {
  const updateNote = async (e) => {
    await customAxios.put(`/${endpoint}/${id}/notes/${note?._id}`, { note: e.target?.value })
  }

  const deleteNote = async (nid) => {
    const result = (await customAxios.delete(`/${endpoint}/${id}/notes/${nid}`)).data
    setReload(prev => !prev)
  }

  return <div className="flex items-center border-4 gap-16 border-secondary w-full p-4">
    <Textarea containerClassName="!border-b-0 w-full" className={"!text-md !w-full !leading-loose"} onChange={updateNote} defaultValue={note?.note}>
      <Label>
        {moment.utc(note?.date).format("YYYY-MM-DD HH:mm:ss")}
      </Label>
    </Textarea>
    <Button style="icon" className={"bg-red-500 text-white"} onClick={() => deleteNote(note?._id)}>
      <RiSubtractFill className="text-3xl" />
    </Button>
  </div>
}

export default Note