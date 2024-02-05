import { Link } from "react-router-dom"
import { Chart } from "react-google-charts"

const BudgetCard = ({ budget }) => {
  const data = [
    ["Money", "Paid"],
    ["Pagado", budget.advanced],
    ["Restante", budget.total],
  ]

  const options = {
    title: "Estado del presupuesto",
    pieHole: 0.2,
    is3D: true,
  };

  return (
    <Link className="bg-secondary shadow-[10px_10px_15px_0px_#f5401c] w-full cursor-pointer border-primary flex flex-col justify-between gap-y-4 py-6 px-3 text-black duration-300 hover:scale-105">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold w-10/12">{budget?.project?.title} - {budget?.supplier?.name}</h2>
      </div>
      <div className="flex flex-col text-2xl">
        <Chart
          chartType="PieChart"
          data={data}
          options={options}
          width={"100%"}
          height={"400px"}
          className="!bg-primary"
        />
      </div>
    </Link>
  )
}

export default BudgetCard