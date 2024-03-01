import { Link } from "react-router-dom"
import { FaTrashAlt } from "react-icons/fa"
import customAxios from "../../config/axios.config.js"
import Swal from "sweetalert2"
import Chart from "react-apexcharts"

const BudgetCard = ({ budget, setReload }) => {
  const onClickTrash = () => {
    Swal.fire({
      title: "Ingresa tu contraseña",
      input: "password",
      inputAttributes: {
        autocapitalize: "off"
      },
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Borrar",
      confirmButtonColor: "#f33",
      showLoaderOnConfirm: true,
      preConfirm: async (password) => {
        try {
          const isValidPassword = (await customAxios.get(`/session/check-password/${password}`))?.data
          if (!isValidPassword?.payload) {
            return Swal.showValidationMessage(`La contraseña es incorrecta`)
          }
          const deleteResult = (await customAxios.delete(`/budget/budget/${budget?._id}`))?.data
          console.log(deleteResult)
          setReload(prev => !prev)
        } catch (error) {
          Swal.showValidationMessage(`
            Request failed: ${error}
          `);
        }
      },
    })
  }

  return (
    <Link to={`/budgets/${budget._id}`} className="bg-secondary shadow-[10px_10px_15px_0px_#f5401c] w-full cursor-pointer border-primary flex flex-col justify-between gap-y-4 py-6 px-3 text-black duration-300 hover:scale-105">
      <div className="flex items-start justify-between">
        <h3 className="text-3xl font-bold w-9/12">{budget?.project?.title} - {budget?.supplier?.name}</h3>
        <Link to={"/budgets"} onClick={onClickTrash} className="hover:text-[#6a6a6a] duration-300">
          <FaTrashAlt className="text-3xl" />
        </Link>
      </div>
      <div className="flex flex-col text-2xl">
        <Chart
          type="pie"
          series={[budget.total - (budget.advanced || 0), (budget.advanced || 0)]}
          options={{ labels: ["Restante", "Pagado"], colors: ["#c22", "#292"], title: { text: "Estado del presupuesto" } }}
        />
      </div>
    </Link>
  )
}

export default BudgetCard