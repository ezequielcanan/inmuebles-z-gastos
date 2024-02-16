const AccountCard = ({account}) => {
  return <div className="bg-secondary shadow-[10px_10px_15px_0px_#f5401c] border-primary flex flex-col justify-between w-full gap-y-4 py-6 px-6 text-black duration-300">
    <h3 className="text-3xl">{account.bank}</h3>
    <p className="text-xl">Alias: {account.alias}</p>
    <p className="text-xl">CBU: {account.cbu}</p>
    <p className="text-xl">CUIT: {account.cuit}</p>
  </div>
}

export default AccountCard