import { Link } from "react-router-dom"
import Chart from "react-apexcharts"

const BudgetCard = ({ budget }) => {
  

  return (
    <Link to={`/budgets/${budget._id}`} className="bg-secondary shadow-[10px_10px_15px_0px_#f5401c] w-full cursor-pointer border-primary flex flex-col justify-between gap-y-4 py-6 px-3 text-black duration-300 hover:scale-105">
      <div className="flex items-center justify-between">
        <h3 className="text-3xl font-bold w-10/12">{budget?.project?.title} - {budget?.supplier?.name}</h3>
      </div>
      <div className="flex flex-col text-2xl">
        <Chart
          type="pie"
          series={[budget.total - (budget.advanced || 0), (budget.advanced || 0)]}
          options={{labels: ["Restante", "Pagado"], colors: ["#c22", "#292"], title: {text: "Estado del presupuesto"}}}
        />
      </div>
    </Link>
  )
}

export default BudgetCard