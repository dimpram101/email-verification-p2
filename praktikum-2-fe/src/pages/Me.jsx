import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import Loading from "react-loading";
import { toast } from "react-toastify";

const BASE_URL = "http://localhost:3000";

const Me = () => {
  const [cookie, , removeCookie] = useCookies();
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPostLoading, setIsPostLoading] = useState(false);

  useEffect(() => {
    const fetchMe = async () => {
      axios
        .get(`${BASE_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${cookie.token}`,
          },
        })
        .then((res) => {
          setMe(res.data.data);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    if (!cookie.token) {
      navigate("/login");
    } else {
      fetchMe();
    }
  }, [cookie.token, navigate]);

  const logout = () => {
    removeCookie("token");
    navigate("/login");
  };

  const verifyEmail = () => {
    setIsPostLoading(true);
    axios
      .post(
        `${BASE_URL}/auth/send-verify-email`,
        {},
        {
          headers: {
            Authorization: `Bearer ${cookie.token}`,
          },
        }
      )
      .then((res) => {
        toast.success(res.data.message);
        // setTimeout(() => navigate("/verify-email"), 1000);
      })
      .catch((err) => {
        toast.error(err.response.message);
      })
      .finally(() => setIsPostLoading(false));
  };

  return (
    <div className="max-w-7xl mx-auto flex items-center justify-center h-screen">
      {isLoading ? (
        <div className="w-[500px] h-[350px] p-4 border rounded-lg shadow-lg flex flex-col justify-center items-center">
          <Loading type="spin" color="#000" height={50} width={50} />
        </div>
      ) : !me ? (
        <div className="w-[500px] h-[350px] p-4 border rounded-lg shadow-lg flex flex-col justify-center items-center">
          <h1 className="text-center font-bold text-3xl">No Data</h1>
        </div>
      ) : (
        <div className="w-[500px] h-fit p-4 border rounded-lg shadow-lg flex flex-col justify-around">
          <h1 className="text-center font-bold text-3xl">My Data</h1>
          <div className="flex flex-col gap-4 mt-8">
            <div className="flex justify-between items-center gap-4">
              <span className="font-bold w-36">Name</span>
              <span className="">:</span>
              <span className="flex-1">{me.full_name}</span>
            </div>
            <div className="flex justify-between items-center gap-4">
              <span className="font-bold w-36">Email</span>
              <span className="">:</span>
              <span className="flex-1">{me.email}</span>
            </div>
            <div className="flex justify-between items-center gap-4">
              <span className="font-bold w-36">Phone Number</span>
              <span className="">:</span>
              <span className="flex-1">{me.phone_number}</span>
            </div>
            <div className="flex justify-between items-center gap-4">
              <span className="font-bold w-36">Verified at</span>
              <span className="">:</span>
              <span className="flex-1">
                {me.verified_at
                  ? new Date(me.verified_at).toLocaleString()
                  : "-"}
              </span>
            </div>
            {!me.verified_at && (
              <button
                onClick={verifyEmail}
                className="bg-blue-500 text-white py-2 rounded-lg"
                disabled={isPostLoading}
              >
                Verify Email
              </button>
            )}
            <button
              onClick={logout}
              className="bg-red-500 text-white py-2 rounded-lg"
              disabled={isPostLoading}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Me;
