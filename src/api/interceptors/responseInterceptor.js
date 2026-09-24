 const responseInterceptor = (response) => {
  return response;
};

const responseErrorInterceptor = (error) => {
  if (error.response?.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }
  return Promise.reject(error);
};

export {
  responseInterceptor,
  responseErrorInterceptor,
};