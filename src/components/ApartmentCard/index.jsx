const ApartmentCard = ({transaction, subtractionType}) => {
  return (
    <div className="bg-secondary shadow-[10px_10px_15px_0px_#f5401c] border-primary flex flex-col justify-between w-full gap-y-4 py-6 px-6 text-black duration-300">
      <div>
        <h3 className="text-2xl font-bold">{transaction?.apartment?.project?.title} - {transaction?.apartment?.unit}</h3>
      </div>
      <div>
        <p className="text-xl">Tomado a: USD{transaction?.total} / ${transaction?.total * transaction?.dolar}</p>
        <p className="text-xl">Metros totales: {transaction?.apartment?.meters?.total}m2</p>
        <p className="text-xl">El descuento se {subtractionType == "total" ? "aplicó al total." : "aplica por cada cuota."}</p>
      </div>
    </div>
  )
}

export default ApartmentCard