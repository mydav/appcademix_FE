


export const refreshTokenAPI = async token => {
    try {
      const response = await fetch(
        "http://localhost:9000/api/auth/refreshtoken",
        {
          headers: {
            Authorization: "Bearer " + token
          },
          method: "POST"
        }
      );
      if (response.ok) return await response.json();
    } catch (error) {
      console.log(error);
    }
  };