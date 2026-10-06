import { Route, Routes } from "react-router-dom"

import { DashboardPage } from "@/pages/DashboardPage"
import { UserDetailPage } from "@/pages/UserDetailPage"

export function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/users/:id" element={<UserDetailPage />} />
    </Routes>
  )
}
