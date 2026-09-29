 const responseInterceptor = (response) => {
  return response;
};

const responseErrorInterceptor = (error) => {
  if (error.response?.status === 401) {
    // Don't redirect if we're already on the login page
    // (e.g. wrong password — let the form handle the error)
    const isLoginPage = window.location.pathname === '/login'
    if (!isLoginPage) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  }
  return Promise.reject(error);
};

export {
  responseInterceptor,
  responseErrorInterceptor,
};