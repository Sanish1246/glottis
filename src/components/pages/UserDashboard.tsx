"use client";

import { useUser } from "../context/UserContext";

import DashboardInfo from "../ui/DashboardInfo";

const UserDashboard = () => {
  const { user } = useUser();

  return (
    <>
      <DashboardInfo user={user} />
    </>
  );
};

export default UserDashboard;
