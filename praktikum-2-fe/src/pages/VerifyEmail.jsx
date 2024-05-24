import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

const BASE_URL = "http://localhost:3000";

const VerifyEmail = () => {
  const [cookie] = useCookies();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const [otp1, setOTP1] = useState("");
  const [otp2, setOTP2] = useState("");
  const [otp3, setOTP3] = useState("");
  const [otp4, setOTP4] = useState("");
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const otp = `${otp1}${otp2}${otp3}${otp4}`;

    setIsLoading(true);
    axios
      .post(
        `${BASE_URL}/auth/verify-email`,
        {
          otp,
        },
        {
          headers: {
            Authorization: `Bearer ${cookie.token}`,
          },
          params: {
            token,
          }
        }
      )
      .then((res) => {
        toast.success(res.data.message);
        setTimeout(() => navigate("/me"), 1000);
      })
      .catch((err) => {
        // console.log(err);
        if (err.response.data.status === "VALIDATION_ERROR") {
          return toast.error(err.response.data.errors[0].token);
        }
        toast.error(err.response.data.message);
      })
      .finally(() => setIsLoading(false));
  };

  // const resendEmail = () => {
  //   setIsLoading(true);
  //   axios
  //     .post(
  //       `${BASE_URL}/auth/send-verify-email`,
  //       {},
  //       {
  //         headers: {
  //           Authorization: `Bearer ${cookie.token}`,
  //         },
  //       }
  //     )
  //     .then((res) => {
  //       toast.success(res.data.message);
  //       setTimeout(() => navigate("/verify-email"), 1000);
  //     })
  //     .catch((err) => {
  //       toast.error(err.response.message);
  //     })
  //     .finally(() => setIsLoading(false));
  // };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="max-w-md mx-auto text-center bg-white px-4 sm:px-8 py-10 rounded-xl shadow">
        <header className="mb-8">
          <h1 className="text-2xl font-bold mb-1">Email Verification</h1>
          <p className="text-[15px] text-slate-500">
            Enter the 4-digit verification code that was sent to your email.
            number.
          </p>
        </header>
        <form id="otp-form" onSubmit={handleSubmit}>
          <div className="flex items-center justify-center gap-3">
            <input
              type="text"
              className="w-14 h-14 text-center text-2xl font-extrabold text-slate-900 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              pattern="\d*"
              maxLength="1"
              required
              value={otp1}
              onChange={(e) => setOTP1(e.target.value)}
            />
            <input
              type="text"
              className="w-14 h-14 text-center text-2xl font-extrabold text-slate-900 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              maxLength="1"
              required
              value={otp2}
              onChange={(e) => setOTP2(e.target.value)}
            />
            <input
              type="text"
              className="w-14 h-14 text-center text-2xl font-extrabold text-slate-900 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              maxLength="1"
              required
              value={otp3}
              onChange={(e) => setOTP3(e.target.value)}
            />
            <input
              type="text"
              className="w-14 h-14 text-center text-2xl font-extrabold text-slate-900 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              maxLength="1"
              required
              value={otp4}
              onChange={(e) => setOTP4(e.target.value)}
            />
          </div>
          <div className="max-w-[260px] mx-auto mt-4">
            <button
              type="submit"
              className="w-full inline-flex justify-center whitespace-nowrap rounded-lg bg-blue-500 px-3.5 py-2.5 text-sm font-medium text-white shadow-sm shadow-blue-950/10 hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-300 transition-colors duration-150"
              disabled={isLoading}
            >
              Verify Email
            </button>
          </div>
        </form>
        {/* <div className="text-sm text-slate-500 mt-4">
          Didnt receive code?{" "}
          <button
            className="font-medium text-indigo-500 hover:text-indigo-600"
            onClick={resendEmail}
          >
            Resend
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default VerifyEmail;
