import { createContext, useEffect, useReducer } from "react";
import axios from "axios";
import { MatxLoading } from "app/components";
import jwtDecode from "jwt-decode";
import REQUEST from "app/services/Request";
import { useNavigate } from "react-router-dom";
const initialState = {
  user: null,
  lookups: null,
  isInitialised: false,
  isAuthenticated: false,
};

const isValidToken = (accessToken) => {
  if (!accessToken) return false;

  //const decodedToken = jwtDecode(accessToken);
  const currentTime = Date.now() / 1000;
  console.log(currentTime);
  return new Date(accessToken.ExpiresOn) > currentTime;
};

const setSession = (accessToken) => {
  if (accessToken) {
    localStorage.setItem("accessToken", JSON.stringify(accessToken));
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken.user.Token}`;
  } else {
    localStorage.removeItem("accessToken");
    delete axios.defaults.headers.common.Authorization;
  }
};

const reducer = (state, action) => {
  switch (action.type) {
    case "INIT": {
      const { isAuthenticated, user } = action.payload;
      return { ...state, isAuthenticated, isInitialised: true, user };
    }

    case "LOGIN": {
      const { user } = action.payload;
      return { ...state, isAuthenticated: true, user };
    }

    case "LOGOUT": {
      return { ...state, isAuthenticated: false, user: null };
    }

    case "REGISTER": {
      const { user } = action.payload;

      return { ...state, isAuthenticated: true, user };
    }
    case "INIT_LOOKUPS": {
      return { ...state, lookups: action.payload };
    }

    default:
      return state;
  }
};

const AuthContext = createContext({
  ...initialState,
  method: "JWT",
  login: () => {},
  logout: () => {},
  register: () => {},
});

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const setUserLookUps = () => {
        dispatch({
          type: "INIT_LOOKUPS",
          payload: {
            
          },
        });
    // REQUEST({
    //   method: "GET",
    //   url: "/auth/data",
    // })
    //   .then((response) => {
    //     // dispatch({
    //     //   type: "INIT_LOOKUPS",
    //     //   payload: {
    //     //     ...response,
    //     //     seasonData: seasonData,
    //     //     Elements: elements,
    //     //     RecipeTypes: RecipeTypes,
    //     //     ModelGroupStates: ModelGroupStates,
    //     //     UserElements: elements.filter((e) =>
    //     //       response.UserElements.map((e) => +e).includes(e.Id)
    //     //     ),
    //     //   },
    //     // });
    //     // notify("data loaded successfully", "success", 3000);
    //   })
    //   .catch((e) => {
    //     dispatch({
    //       type: "INIT",
    //       payload: {
    //         isAuthenticated: false,
    //         user: null,
    //       },
    //     });
    //     notify("check your internet connection", "error", 3000);
    //   });
  };
  const login = async (email, password) => {
    const response = await REQUEST({
      method: "post",
      url: "/auth/login",
      data: {
        email: email,
        password: password,
      },
    });

    if (!response.Role || response.Role.toLowerCase() !== "admin") {
      throw new Error("Access denied: insufficient permissions");
    }

    setSession({
      user: response,
      isAuthenticated: true,
    });
    console.log(response);
    setUserLookUps();

    dispatch({
      type: "LOGIN",
      payload: {
        user: response,
        isAuthenticated: true,
      },
    });
  };
  const navigate = useNavigate();
  const register = async (values) => {
    const response = await REQUEST({
      method: "post",
      url: "/auth/register",
      data: values,
    });
    console.log(response);
    const { accessToken, user } = response;
    console.log(response);
    setSession(accessToken);
    navigate("/login");
    // dispatch({
    //   type: "REGISTER",
    //   payload: {
    //     user,
    //   },
    // });
  };

  const logout = () => {
    setSession(null);
    dispatch({ type: "LOGOUT" });
  };

  useEffect(() => {
    (async () => {
      try {
        const accessToken = JSON.parse(
          window.localStorage.getItem("accessToken")
        );
        console.log(accessToken);
        if (accessToken && isValidToken(accessToken.user)) {
          setSession(accessToken);
          console.log(accessToken);
          setUserLookUps();
          dispatch({
            type: "INIT",
            payload: accessToken,
          });
        } else {
          dispatch({
            type: "INIT",
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: "INIT",
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    })();
  }, []);

  if (!state.isInitialised) {
    return <MatxLoading loading={true} />;
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: "JWT",
        login,
        logout,
        register,
        setUserLookUps,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
