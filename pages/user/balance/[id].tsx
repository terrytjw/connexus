import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import React from "react";
import Button from "../../../components/Button";
import { getUserInfo } from "../../../lib/api-helpers/user-api";
import { UserWithAllInfo } from "../../api/users/[userId]";
import { Controller, useForm } from "react-hook-form";
import Input from "../../../components/Input";
import ProtectedRoute from "../../../components/ProtectedRoute";
import Layout from "../../../components/Layout";

type WithdrawalTableProps = {
  data: any[]; // TODO: change type any to data type
  columns: string[];
};

const WithdrawalTable = ({ data, columns }: WithdrawalTableProps) => {
  return (
    <div className="w-full overflow-x-auto text-sm text-gray-500 sm:text-base">
      <table className="table w-full">
        {/* <!-- head --> */}
        <thead>
          <tr>
            {columns.map((headerTitle, index) => (
              <th className="text-center" key={index}>
                {headerTitle}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* <!-- row --> */}
          {data.map((data, index) => (
            <tr className="text-center" key={index}>
              <td>
                <div className="">{data.id}</div>
              </td>
              <td>{data.date}</td>
              <td>
                <span className="">{data.amount}</span>
              </td>
              <td>
                <span className="badge  border-yellow-500 bg-yellow-500 font-semibold text-white">
                  {data.status}
                </span>
                {/* <span className="badge border-green-500 bg-green-500 font-semibold text-white">
                  {data.status}
                </span> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

type BalancePageProps = {
  userData: UserWithAllInfo;
};
const BalancePage = ({ userData }: BalancePageProps) => {
  type BankDetailsForm = {
    bankName: string;
    accountName: string;
    bankAccountNum: string;
    bankRoutingNum: string;
  };
  const { handleSubmit, control } = useForm<BankDetailsForm>({
    // defaultValues: {
    //   bankName: userData.bankName ?? "",
    //   accountName: userData.accountName ?? "",
    //   bankAccountNum: userData.bankAccountNum ?? "",
    //   bankRoutingNum: userData.bankRoutingNum ?? "",
    // },
  });

  const onSubmit = async (formData: BankDetailsForm) => {
    console.log("bank details form data -> ", formData);

    // const updatedUserData = {
    //   ...userData, // this is the user data from the database
    //   ...formData, // this is the user data fields from the form overwriting the database data
    // };

    // const response = await updateUserInfo(userData.userId, updatedUserData);
    // router.push(`/user/profile/${userData.userId}`);
  };

  return (
    <ProtectedRoute>
      <Layout>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-7xl p-6 pb-60 lg:px-12"
        >
          <h1 className="mb-4 text-2xl font-bold">Account Balance</h1>
          {/* account hero section */}
          <section className="mb-8 bg-white p-4 shadow-lg lg:mb-12 lg:p-8">
            <h4 className="mb-8 text-sm text-gray-500 lg:mb-16 lg:text-base">
              Your Balance
            </h4>
            <div className="flex justify-between py-2">
              <h2 className="text-3xl font-semibold text-blue-500 lg:text-4xl">
                $12345
              </h2>
              <Button
                className="lg:hidden"
                variant="solid"
                size="sm"
                type="submit"
              >
                Withdraw
              </Button>
              <Button
                className="hidden lg:inline-block"
                variant="solid"
                size="md"
                type="submit"
              >
                Withdraw
              </Button>
            </div>
          </section>

          {/* fill up bank details section */}
          <section className="mb-4 max-w-2xl lg:mb-8">
            <h4 className="mb-4 text-lg font-semibold">Bank details</h4>
            <Controller
              control={control}
              name="bankName"
              rules={{ required: "Bank name is required" }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <Input
                  type="text"
                  label="Bank Name*"
                  value={value}
                  onChange={onChange}
                  placeholder=""
                  errorMessage={error?.message}
                  size="md"
                  variant="bordered"
                />
              )}
            />
            <Controller
              control={control}
              name="accountName"
              rules={{ required: "Full account name is required" }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <Input
                  type="text"
                  label="Full Account Name*"
                  value={value}
                  onChange={onChange}
                  placeholder=""
                  errorMessage={error?.message}
                  size="md"
                  variant="bordered"
                />
              )}
            />
            <Controller
              control={control}
              name="bankAccountNum"
              rules={{ required: "Bank name is required" }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <Input
                  type="text"
                  label="Bank Account Number*"
                  value={value}
                  onChange={onChange}
                  placeholder=""
                  errorMessage={error?.message}
                  size="md"
                  variant="bordered"
                />
              )}
            />
            <Controller
              control={control}
              name="bankRoutingNum"
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <Input
                  type="text"
                  label="Bank Routing Number"
                  value={value}
                  onChange={onChange}
                  placeholder=""
                  errorMessage={error?.message}
                  size="md"
                  variant="bordered"
                />
              )}
            />
          </section>

          {/* withdrawal history section */}
          <section>
            <h2 className="mb-6 text-lg font-semibold">Withdrawal History</h2>
            <WithdrawalTable
              data={[
                {
                  id: "936284",
                  date: "17-03-2023",
                  amount: 69,
                  status: "Pending",
                },
                {
                  id: "429438",
                  date: "12-03-2023",
                  amount: 100,
                  status: "Completed",
                },
                {
                  id: "892638",
                  date: "02-02-2023",
                  amount: 120,
                  status: "Completed",
                },
              ]}
              columns={["Transaction ID", "Date", "Amount (SGD)", "Status"]}
            />
          </section>
        </form>
      </Layout>
    </ProtectedRoute>
  );
};

export default BalancePage;

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const session = await getSession(context);
  const userId = session?.user.userId;

  if (!userId) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const userData = await getUserInfo(parseInt(userId));

  return {
    props: {
      userData,
    },
  };
};
