import { useEffect, useState } from "react"
import { BounceLoader } from "react-spinners"
import Title from "../../components/Title"
import Main from "../../containers/Main"
import customAxios from "../../config/axios.config"
import { Link } from "react-router-dom"
import Button from "../../components/Button"
import { FaPlus } from "react-icons/fa"
import Section from "../../containers/Section"
import AccountCard from "../../components/AccountCard"

const Accounts = () => {
  const [accounts, setAccounts] = useState(false)

  useEffect(() => {
    customAxios.get("/account").then(res => {
      setAccounts(res?.data?.payload || [])
    })
  }, [])

  return (
    <Main className={"flex flex-col gap-y-[70px]"} paddings>
      <Section>
        <Title className={"text-center md:text-start"}>
          Cuentas bancarias
        </Title>
        <Link to={"/accounts/new"}>
          <Button>Agregar Cuenta <FaPlus/></Button>
        </Link>
      </Section>
      <section className="grid lg:grid-cols-4 sm:grid-cols-2 gap-6">
        {accounts ? (
          <>
            {accounts.length ? (
              accounts.map((account,i) => {
                return <AccountCard account={account} key={i}/>
              })
            ) : (
              <h2>No hay cuentas registradas</h2>
            )}
          </>
        ) : <BounceLoader/>}
      </section>
    </Main>
  )
}

export default Accounts