import { useEffect, useState } from "react";
import Loading from "react-loading";
import axios from "axios";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:3000";

const Register = () => {
  const [data, setData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [cookie] = useCookies("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (cookie.token) {
      navigate("/me");
    }
  }, [cookie.token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    axios
      .post(`${BASE_URL}/auth/register`, data)
      .then((res) => {
        toast.success(res.data.message);
        navigate("/login");
      })
      .catch((err) => {
        console.log(err);
        const { data } = err.response;
        if (data.status === "VALIDATION_ERROR") {
          const err = {};
          const errorData = data.errors;
          errorData.forEach((error) => {
            const objKey = Object.keys(error)[0];
            err[objKey] = error[objKey].replace("String", "");
          });
          setErrors(err);
        } else {
          toast.error(data.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="max-w-7xl mx-auto flex items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="w-[500px] h-fit p-4 border rounded-lg shadow-lg flex flex-col justify-around"
      >
        <h1 className="text-center text-3xl font-bold">Register</h1>
        <div className="flex flex-col gap-4 mt-6">
          <div className="flex flex-col gap-2">
            <label>Full Name</label>
            <input
              type="text"
              className="border p-2 rounded-lg"
              value={data.full_name}
              onChange={(e) => setData({ ...data, full_name: e.target.value })}
              required
            />
            {errors.full_name && (
              <p className="text-red-500 text-xs">Full Name {errors.full_name}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label>Phone Number</label>
            <input
              type="number"
              className="border p-2 rounded-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              value={data.phone_number}
              onChange={(e) => setData({ ...data, phone_number: e.target.value })}
              required
            />
            {errors.phone_number && (
              <p className="text-red-500 text-xs">{errors.phone_number}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label>Email</label>
            <input
              type="email"
              className="border p-2 rounded-lg"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label>Password</label>
            <input
              type="password"
              className="border p-2 rounded-lg"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              required
            />
            {errors.password && (
              <p className="text-red-500 text-xs">Password{errors.password}</p>
            )}
          </div>
        </div>
        <button
          className="bg-blue-500 flex justify-center w-full text-white p-2 rounded-lg mt-4 hover:bg-blue-600 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? (
            <Loading
              type="spin"
              color="#fff"
              height={20}
              width={20}
              className=""
            />
          ) : (
            "Register"
          )}
        </button>
      </form>
    </div>
  );
};

export default Register;
