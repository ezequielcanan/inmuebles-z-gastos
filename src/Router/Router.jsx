import { HashRouter, Routes, Route, Navigate } from "react-router-dom"
import { UserContext } from "../context/userContext"
import { useContext } from "react"
import Home from "../pages/Home"
import Navbar from "../components/Navbar"
import Login from "../pages/Login"
import Register from "../pages/Register"
import Suppliers from "../pages/Suppliers"
import NewSupplier from "../pages/NewSupplier"
import Supplier from "../pages/Supplier"
import Projects from "../pages/Projects"
import Budgets from "../pages/Budgets"
import NewBudget from "../pages/NewBudget"
import Accounts from "../pages/Accounts"
import NewAccount from "../pages/NewAccount"
import Budget from "../pages/Budget"
import NewPayment from "../pages/NewPayment"
import Payment from "../pages/Payment"
import NewSubpayment from "../pages/NewSubpayment"
import Subpayment from "../pages/Subpayment"
import Bill from "../pages/Bill"
import EditSubpayment from "../pages/EditSubpayment"

const Router = () => {
  const { getUser, setUser } = useContext(UserContext)


  return (
    <HashRouter>
      <Navbar user={getUser()} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home user={getUser()} />} />
        {!getUser() ? (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to={"/login"} />} />
          </>
        ) : (
          <>
            <Route path="/suppliers" element={<Suppliers/>}/>
            <Route path="/suppliers/:sid" element={<Supplier/>}/>
            <Route path="/suppliers/new" element={<NewSupplier/>}/>
            <Route path="/projects" element={<Projects/>}/>
            <Route path="/budgets" element={<Budgets/>}/>
            <Route path="/budgets/:bid" element={<Budget/>}/>
            <Route path="/budgets/:bid/payments/new" element={<NewPayment/>}/>
            <Route path="/budgets/:bid/payments/:pid" element={<Payment/>}/>
            <Route path="/budgets/:bid/payments/:pid/:billId" element={<Bill/>}/>
            <Route path="/budgets/:bid/payments/:pid/:type/:sid" element={<Subpayment/>}/>
            <Route path="/budgets/:bid/payments/:pid/:type/:sid/edit" element={<EditSubpayment/>}/>
            <Route path="/budgets/:bid/payments/:pid/:type/new" element={<NewSubpayment/>}/>
            <Route path="/budgets/new" element={<NewBudget/>}/>
            <Route path="/accounts" element={<Accounts/>}/>
            <Route path="/accounts/new" element={<NewAccount/>}/>
          </>
        )}
      </Routes>
    </HashRouter>
  )
}

export default Router