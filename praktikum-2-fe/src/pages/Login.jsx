import { useEffect, useState } from "react";
import Loading from "react-loading";
import axios from "axios";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:3000";

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [cookie, setCookie] = useCookies("token");
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
      .post(`${BASE_URL}/auth/login`, data)
      .then((res) => {
        toast.success(res.data.message);
        setCookie("token", res.data.data.token, {
          expires: new Date(res.data.data.expiresIn),
        });
        navigate("/me");
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
        <h1 className="text-center text-3xl font-bold">Login</h1>
        <div className="flex flex-col gap-4">
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
        <Link to={"/register"} className="text-xs text-right w-full mt-4 underline text-blue-500">Create new account</Link>
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
            "Login"
          )}
        </button>
      </form>
    </div>
  );
};

export default Login;
