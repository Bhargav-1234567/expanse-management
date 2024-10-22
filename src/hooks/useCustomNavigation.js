import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const useCustomNavigation = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useMemo(() => {
    const paramsObject = {};
    searchParams.forEach((value, key) => {
      paramsObject[key] = value;
    });
    return paramsObject;
  }, [searchParams]);

  const addQueryParam = (key, value) => {
    setSearchParams({ [key]: value });
  };

  const removeQueryParam = (keys) => {
    const newParams = new URLSearchParams(searchParams);
    const keysArray = Array.isArray(keys) ? keys : [keys];
    keysArray.forEach((key) => newParams.delete(key));
    navigate(`?${newParams.toString()}`, { replace: true });
  };

  return {
    addQueryParam,
    removeQueryParam,
    navigate,
    params,
  };
};

export default useCustomNavigation;
